const loader = new google.maps.plugins.loader.Loader({
    apiKey: "AIzaSyB7MgcZpkMYMSxkZTEV2df1TNwC_7-wns8",
    version: "weekly",
    mapIds: ["a10248fd49904966"],
    libraries: ["places", "geometry"]
  });
  
  let map;
  let markers = [];
  let userMarker;
  let directionsService;
  let directionsRenderer;
  let contextMenu;
  let floatingSearch;
  let measureTool;

  let polygonList = [];
  let pendingPath = null; // temp storage for current measurement path
  let selectedPolygon = null;
  let currentLevel = null;
  
  loader.load().then(async () => {
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const { DirectionsService, DirectionsRenderer } = await google.maps.importLibrary("routes");
  
    const pretoria = { lat: -25.7479, lng: 28.2293 };
  
    map = new Map(document.getElementById("map"), {
      center: pretoria,
      zoom: 10,
      mapId: "a10248fd49904966",
    });

    map.addListener("rightclick", onMapRightClick);
    // Hide menu on left-click anywhere
    map.addListener("click", hideContextMenu);

    map.addListener("click", function () {
      if (selectedPolygon) {
        selectedPolygon.setEditable(false);
        selectedPolygon = null;
      }
      hidePolygonMenu();
    });

    contextMenu = document.getElementById("context-menu");
    //floatingSearch = document.getElementById("floating-search");
    floatingSearch = document.createElement("gmpx-place-autocomplete");
    floatingSearch.setAttribute("id", "floating-search");
    floatingSearch.setAttribute("placeholder", "Search for a place...");
    floatingSearch.style.cssText = "position:absolute; top:70px; right:20px; z-index:1001; width:300px; background:white; display:none;";
    document.body.appendChild(floatingSearch);
  
    directionsService = new DirectionsService();
    directionsRenderer = new DirectionsRenderer({ map });
  
    const autocompleteElement = document.createElement("gmpx-place-autocomplete");
    autocompleteElement.setAttribute("placeholder", "Search for a place...");
    document.getElementById("autocomplete").appendChild(autocompleteElement);
  
    autocompleteElement.addEventListener("gmpx-placeautocomplete:place", (e) => {
      const place = e.detail.place;
      if (!place || !place.location) return;
  
      const location = {
        lat: place.location.latitude,
        lng: place.location.longitude,
      };
  
      const marker = new AdvancedMarkerElement({
        map,
        position: location,
        title: place.displayName?.text || "Place",
      });
  
      markers.push(marker);
      map.panTo(location);
      map.setZoom(14);


     
  
      if (userMarker) {
        calculateAndDisplayRoute(userMarker.position, location);
      }
    });

    if (typeof MeasureTool !== "undefined") {
        measureTool = new MeasureTool(map, {
          showSegmentLength: true,
          unit: MeasureTool.UnitTypeId.METRIC
        });
      } else {
        console.error("MeasureTool failed to load.");
      }
  
    locateMe();

    document.getElementById("polygon-file-input").addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (!file) return;
    
      const reader = new FileReader();
      reader.onload = function (event) {
        const content = event.target.result;
    
        if (file.name.endsWith(".geojson")) {
          const geojson = JSON.parse(content);
          importPolygonsFromGeoJSON(geojson);
        } else if (file.name.endsWith(".json")) {
          const json = JSON.parse(content);
          json.forEach(importPolygonFromData);
        } else {
          alert("Unsupported file type.");
        }
      };
    
      reader.readAsText(file);
    });

    document.getElementById('exportButton').addEventListener('click', exportPolygons);
    document.getElementById('importButton').addEventListener('click', importPolygons);

  }).catch(err => {
    console.error("Google Maps failed to load:", err);
  });


   
  
  
  
  //document.addEventListener("contextmenu", function (e) {
  //  const mapDiv = document.getElementById("map");
  //  if (mapDiv && (e.target === mapDiv || mapDiv.contains(e.target))) {
  //    e.preventDefault(); // Suppress browser menu on the map only
  //  }
  //});

  document.addEventListener("contextmenu", function (e) {
    const mapDiv = document.getElementById("map");
    const rect = mapDiv.getBoundingClientRect();
  
    const withinX = e.clientX >= rect.left && e.clientX <= rect.right;
    const withinY = e.clientY >= rect.top && e.clientY <= rect.bottom;
  
    if (withinX && withinY) {
      e.preventDefault(); // Click is visually inside the map
    }
  });
  
  
  window.locateMe = function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
  
        if (!userMarker) {
          userMarker = new google.maps.marker.AdvancedMarkerElement({
            map,
            position: pos,
            title: "You are here",
          });
        } else {
          userMarker.position = pos;
        }
  
        map.setCenter(pos);
      });
    } else {
      alert("Geolocation not supported.");
    }
  };
  
  window.clearMarkers = function () {
    markers.forEach(m => m.map = null);
    markers = [];
    directionsRenderer.set('directions', null);
  };
  
  function calculateAndDisplayRoute(origin, destination) {
    directionsService.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(response);
        } else {
          alert("Directions request failed: " + status);
        }
      }
    );
  }

  // Handle Right-Click on Map
//let contextMenu = document.getElementById("context-menu");
//let floatingSearch = document.getElementById("floating-search");

//function showFloatingSearch() {
//  floatingSearch.style.display = "block";
//}

function showFloatingSearch() {
    if (floatingSearch.style.display === "block") {
      floatingSearch.style.display = "none";
    } else {
      floatingSearch.style.display = "block";
    }
  }

function hideContextMenu() {
  contextMenu.style.display = "none";
}

function serializePolygon(meta) {
  const path = meta.polygon.getPath().getArray().map(coord => ({
    lat: coord.lat(),
    lng: coord.lng()
  }));

  return {
    name: meta.name,
    style: meta.style,
    path: path,
    children: meta.children ? meta.children.map(serializePolygon) : []
  };
}

async function exportPolygons() {
  try {
    const options = {
      suggestedName: 'polygons.json',
      types: [
        {
          description: 'Polygon Files',
          accept: {
            'application/json': ['.json'],
            'application/geo+json': ['.geojson'],
            'application/vnd.google-earth.kml+xml': ['.kml']
          }
        }
      ]
    };

    // Show save file picker
    const handle = await window.showSaveFilePicker(options);
    const writable = await handle.createWritable();

    // Serialize polygon data
    const data = polygonList.map(serializePolygon);
    const jsonString = JSON.stringify(data, null, 2);

    // Write data to file
    await writable.write(jsonString);
    await writable.close();

    showToast('Polygons saved successfully.');
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('Save failed:', err);
      showToast('Failed to save polygons.');
    }
  }
}

function deserializePolygon(data, parent = null) {
  const polygon = new google.maps.Polygon({
    paths: data.path,
    ...data.style
  });

  const meta = {
    name: data.name,
    polygon: polygon,
    style: data.style,
    children: [],
    parent: parent
  };

  if (data.children && data.children.length > 0) {
    meta.children = data.children.map(childData => deserializePolygon(childData, meta));
  }

  return meta;
}

async function importPolygons() {
  try {
    const options = {
      types: [
        {
          description: 'Polygon Files',
          accept: {
            'application/json': ['.json'],
            'application/geo+json': ['.geojson'],
            'application/vnd.google-earth.kml+xml': ['.kml']
          }
        }
      ],
      multiple: false
    };

    // Show open file picker
    const [handle] = await window.showOpenFilePicker(options);
    const file = await handle.getFile();
    const contents = await file.text();

    let data;
    if (file.name.endsWith('.kml')) {
      // Parse KML to GeoJSON using togeojson
      const parser = new DOMParser();
      const kmlDoc = parser.parseFromString(contents, 'application/xml');
      const geojson = toGeoJSON.kml(kmlDoc);
      data = geojson.features.map(feature => ({
        name: feature.properties.name || 'Unnamed',
        style: {}, // Extract style if available
        path: feature.geometry.coordinates[0].map(coord => ({ lat: coord[1], lng: coord[0] })),
        children: []
      }));
    } else {
      // Parse JSON or GeoJSON
      data = JSON.parse(contents);
    }

    // Deserialize and render polygons
    polygonList = data.map(item => deserializePolygon(item));
    renderPolygonLevel();

    showToast('Polygons imported successfully.');
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('Import failed:', err);
      showToast('Failed to import polygons.');
    }
  }
}



function showToast(message, duration = 3000) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

function importPolygonFromData(data) {
  const path = data.path.map(p => new google.maps.LatLng(p.lat, p.lng));
  const polygon = new google.maps.Polygon({
    paths: path,
    strokeColor: data.style.strokeColor,
    strokeOpacity: data.style.strokeOpacity,
    strokeWeight: data.style.strokeWeight,
    fillColor: data.style.fillColor,
    fillOpacity: data.style.fillOpacity,
    editable: false,
    draggable: true,
    map
  });

  const label = new google.maps.Marker({
    position: getPolygonCenter(path),
    label: { text: data.name, color: "#333", fontSize: "12px", fontWeight: "bold" },
    icon: { path: google.maps.SymbolPath.CIRCLE, scale: 0 },
    map
  });

  polygon.addListener("rightclick", function (event) {
    showPolygonContextMenu(polygon, event.latLng, event.domEvent);
  });

  polygonList.push({ name: data.name, polygon, label, style: data.style });
}

function importPolygonsFromGeoJSON(geojson) {
  if (!geojson.features || !Array.isArray(geojson.features)) {
    alert("Invalid GeoJSON structure.");
    return;
  }

  geojson.features.forEach(feature => {
    if (
      feature.geometry?.type === "Polygon" &&
      Array.isArray(feature.geometry.coordinates)
    ) {
      const coordinates = feature.geometry.coordinates[0]; // Outer ring
      const path = coordinates.map(coord => new google.maps.LatLng(coord[1], coord[0]));

      const style = feature.properties?.style || {
        strokeColor: "#00A",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#00A",
        fillOpacity: 0.25
      };

      const name = feature.properties?.name || "Imported Polygon";

      const polygon = new google.maps.Polygon({
        paths: path,
        strokeColor: style.strokeColor,
        strokeOpacity: style.strokeOpacity,
        strokeWeight: style.strokeWeight,
        fillColor: style.fillColor,
        fillOpacity: style.fillOpacity,
        editable: false,
        draggable: true,
        map
      });

      const label = new google.maps.Marker({
        position: getPolygonCenter(path),
        label: { text: name, color: "#333", fontSize: "12px", fontWeight: "bold" },
        icon: { path: google.maps.SymbolPath.CIRCLE, scale: 0 },
        map
      });

      polygon.addListener("rightclick", function (event) {
        showPolygonContextMenu(polygon, event.latLng, event.domEvent);
      });

      polygonList.push({ name, polygon, label, style });
    }
  });

  let importCount = 0;
geojson.features.forEach(feature => {
  if (feature.geometry?.type === "Polygon" && Array.isArray(feature.geometry.coordinates)) {
    // existing import logic...
    importCount++;
  }
});
if (importCount > 0) {
  showToast(`✅ Imported ${importCount} polygon${importCount > 1 ? 's' : ''} successfully`);
}
}

function onMapRightClick(e) {
    e.domEvent.preventDefault();
  
    const hasCtrl = e.domEvent.ctrlKey;
    const hasShift = e.domEvent.shiftKey;
    const hasAlt = e.domEvent.altKey;
  
    if (!hasCtrl && !hasShift && !hasAlt) {
      const menu = contextMenu;
  const x = e.domEvent.clientX;
  const y = e.domEvent.clientY;
  const menuWidth = menu.offsetWidth || 200;
  const menuHeight = menu.offsetHeight || 200;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let left = x;
  let top = y;

  if (x + menuWidth > vw) left = vw - menuWidth - 10;
  if (y + menuHeight > vh) top = vh - menuHeight - 10;

  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
  menu.style.display = "block";
  requestAnimationFrame(() => {
    const menuItems = contextMenu.querySelectorAll('.menu-item');
  
    menuItems.forEach(item => {
      const submenu = item.querySelector('.submenu');
      if (!submenu) return;
  
      // Temporarily show submenu off-screen for measurement
      const originalDisplay = submenu.style.display;
      submenu.style.visibility = 'hidden';
      submenu.style.display = 'block';
  
      const parentRect = item.getBoundingClientRect();
      const submenuRect = submenu.getBoundingClientRect();
  
      // Flip submenu to the left if needed
      if (parentRect.right + submenuRect.width > window.innerWidth) {
        submenu.classList.add('submenu-left');
      } else {
        submenu.classList.remove('submenu-left');
      }
  
      // Flip upward if needed
      if (parentRect.top + submenuRect.height > window.innerHeight) {
        submenu.style.top = 'auto';
        submenu.style.bottom = '0';
      } else {
        submenu.style.top = '0';
        submenu.style.bottom = 'auto';
      }
  
      // Revert style back to original
      submenu.style.display = originalDisplay;
      submenu.style.visibility = '';
    });
  });
  menu.focus();
    }
  }

  let copiedPolygonMeta = null;

document.addEventListener("keydown", function (e) {
  // 🔁 COPY / PASTE for polygons
  if (e.ctrlKey && e.key === "Delete" && selectedPolygon) {
    console.log("Delet polygon:", copiedPolygonMeta?.name);
    //const polyToBeDeleted = polygonList.find(selectedPolygon);
    return;
  }


  if (e.ctrlKey && e.key === "c" && selectedPolygon) {
    copiedPolygonMeta = polygonList.find(p => p.polygon === selectedPolygon);
    console.log("Copied polygon:", copiedPolygonMeta?.name);
    return;
  }

  if (e.ctrlKey && e.key === "v" && copiedPolygonMeta) {
    const originalPath = copiedPolygonMeta.polygon.getPath().getArray();
    const offsetPath = originalPath.map(p => new google.maps.LatLng(p.lat() + 0.0001, p.lng() + 0.0001));

    pendingPath = offsetPath;

    document.getElementById("poly-name").value = "";
    document.getElementById("stroke-color").value = copiedPolygonMeta.style.strokeColor;
    document.getElementById("stroke-opacity").value = copiedPolygonMeta.style.strokeOpacity;
    document.getElementById("stroke-weight").value = copiedPolygonMeta.style.strokeWeight;
    document.getElementById("fill-color").value = copiedPolygonMeta.style.fillColor;
    document.getElementById("fill-opacity").value = copiedPolygonMeta.style.fillOpacity;

    document.getElementById("polygon-modal").style.display = "block";
    editingPolygonMeta = null;

    return;
  }

  // ⬇️ CONTEXT MENU NAVIGATION
  const menu = document.getElementById("context-menu");
  if (menu.style.display === "block") {
    const focusable = menu.querySelectorAll('[tabindex="0"]');
    const current = document.activeElement;
    const index = Array.from(focusable).indexOf(current);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = focusable[index + 1] || focusable[0];
      next.focus();
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = focusable[index - 1] || focusable[focusable.length - 1];
      prev.focus();
    }

    if (e.key === "Escape") {
      hideContextMenu();
    }

    if (e.key === "Enter") {
      current.click();
    }
  }
});
  

  window.startMeasuring = function () {
    hideContextMenu(); // Optional: close menu when action starts
    measureTool.start();
  };

  window.endMeasuring = function () {
    hideContextMenu();
    measureTool.end();
  };

  window.createPolygonFromMeasurement = function () {
    hideContextMenu();
  
    if (!measureTool || !measureTool.points || measureTool.points.length < 3) {
      alert("You need at least 3 points to create a polygon.");
      return;
    }
  
    // Store the path but do NOT end the measurement yet
    //pendingPath = measureTool.markers.map(marker => marker.getPosition());
    pendingPath = measureTool.points.map(p => new google.maps.LatLng(p.lat, p.lng));
    const path = measureTool.points.map(point => point.latLng);
  
    // Show modal
    document.getElementById("polygon-modal").style.display = "block";
  };

  function closePolygonModal() {
    document.getElementById("polygon-modal").style.display = "none";
    pendingPath = null;
  }

  function getPolygonCenter(path) {
    const bounds = new google.maps.LatLngBounds();
    path.forEach(point => bounds.extend(point));
    return bounds.getCenter();
  }

  function renderPolygonLevel() {
    function hideAll(list) {
      list.forEach(meta => {
        if (meta && meta.polygon) meta.polygon.setMap(null);
        if (meta && meta.label) meta.label.setMap(null);
        if (meta && Array.isArray(meta.children)) {
          hideAll(meta.children);
        }
      });
    }
  
    hideAll(polygonList);
  
    const toShow = currentLevel && Array.isArray(currentLevel.children) ? currentLevel.children : polygonList;
  
    toShow.forEach(meta => {
      if (meta && meta.polygon) meta.polygon.setMap(map);
      if (meta && meta.label) meta.label.setMap(map);
    });
  
    showToast(`Viewing ${currentLevel?.name || "top-level"} polygons`);
  }

  function findMetaByPolygon(polygon, list = polygonList) {
    for (const meta of list) {
      if (meta.polygon === polygon) {
        return meta;
      }
      if (meta.children && meta.children.length > 0) {
        const found = findMetaByPolygon(polygon, meta.children);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  function attachHierarchyNavigation(polygon, metadata) {
    polygon.addListener("click", (e) => {
      if (e.domEvent.altKey && e.domEvent.shiftKey) {
        const clickedMeta = findMetaByPolygon(polygon);
        if (clickedMeta) {
          currentLevel = clickedMeta;
          renderPolygonLevel();
        } else {
          showToast("Polygon metadata not found.");
        }
      }
    });
  
    polygon.addListener("rightclick", (e) => {
      if (e.domEvent.altKey && e.domEvent.shiftKey) {
        if (currentLevel && currentLevel.parent) {
          currentLevel = currentLevel.parent;
          renderPolygonLevel();
        } else {
          currentLevel = null; // Navigate back to top-level
          renderPolygonLevel();
        }
      }
      else
      {
        showPolygonContextMenu(polygon, e.latLng, e.domEvent);
      }
    });
  }
  
  function savePolygon() {
    const name = document.getElementById("poly-name").value.trim();
    const strokeColor = document.getElementById("stroke-color").value;
    const strokeOpacity = parseFloat(document.getElementById("stroke-opacity").value);
    const strokeWeight = parseInt(document.getElementById("stroke-weight").value);
    const fillColor = document.getElementById("fill-color").value;
    const fillOpacity = parseFloat(document.getElementById("fill-opacity").value);
  
    if (!name || !pendingPath) {
      alert("Missing name or no path data.");
      return;
    }
  
    if (editingPolygonMeta) {
      // UPDATE EXISTING POLYGON
      const poly = editingPolygonMeta.polygon;
      poly.setOptions({
        strokeColor,
        strokeOpacity,
        strokeWeight,
        fillColor,
        fillOpacity,
      });
  
      editingPolygonMeta.name = name;
      editingPolygonMeta.style = { strokeColor, strokeOpacity, strokeWeight, fillColor, fillOpacity };
  
      // Update label
      editingPolygonMeta.label.setPosition(getPolygonCenter(pendingPath));
      editingPolygonMeta.label.setLabel({ text: name });
  
      editingPolygonMeta = null; // clear for next time
    } else {
      // CREATE NEW POLYGON (existing code unchanged)
      const polygon = new google.maps.Polygon({
        paths: pendingPath,
        strokeColor,
        strokeOpacity,
        strokeWeight,
        fillColor,
        fillOpacity,
        editable: false,
        draggable: true,
        map
      });
  
      const labelPosition = getPolygonCenter(pendingPath);
      const nameLabel = new google.maps.Marker({
        position: labelPosition,
        label: {
          text: name,
          color: "#333",
          fontSize: "12px",
          fontWeight: "bold"
        },
        icon: { path: google.maps.SymbolPath.CIRCLE, scale: 0 },
        map
      });

      const newPolygonMeta = {
        name: name,
        polygon: polygon,
        label: nameLabel,
        style: {
          strokeColor: strokeColor,
          strokeOpacity: strokeOpacity,
          strokeWeight: strokeWeight,
          fillColor: fillColor,
          fillOpacity: fillOpacity
        },
        children: [],
        parent: currentLevel
      };
      
      if (currentLevel) {
        currentLevel.children.push(newPolygonMeta);
      } else {
        polygonList.push(newPolygonMeta);
      }
      
      //const targetList = currentLevel ? currentLevel.children : polygonList;
      //targetList.push(newPolygonMeta);
  
      
      //polygon.addListener("rightclick", function (event) {
      //  showPolygonContextMenu(polygon, event.latLng, event.domEvent);
      //});

      polygon.addListener("dragend", function () {
        const updatedPath = polygon.getPath().getArray();
        const center = getPolygonCenter(updatedPath);
      
        const meta = polygonList.find(p => p.polygon === polygon);
        if (meta && meta.label) {
          meta.label.setPosition(center);
        }
      });
  
      polygon.addListener("drag", function () {
        const center = getPolygonCenter(polygon.getPath().getArray());
        const meta = polygonList.find(p => p.polygon === polygon);
        if (meta && meta.label) {
          meta.label.setPosition(center);
        }
      });

      polygon.addListener("click", function () {
        if (selectedPolygon && selectedPolygon !== polygon) {
          selectedPolygon.setEditable(false);
        }
      
        selectedPolygon = polygon;
      });

      polygon.addListener("mousedown", function (e) {
        if (e.domEvent.ctrlKey) {
          const path = polygon.getPath();
          let closestIdx = -1;
          let closestDist = Infinity;
      
          path.forEach((point, index) => {
            const dist = google.maps.geometry.spherical.computeDistanceBetween(point, e.latLng);
            if (dist < 10) { // within 10 meters
              closestIdx = index;
              closestDist = dist;
            }
          });
      
          if (closestIdx >= 0 && path.getLength() > 3) {
            path.removeAt(closestIdx);
          }
        }
      });

      

      attachHierarchyNavigation(polygon, newPolygonMeta); // after you’ve defined newPolygonMeta
    }

    
  
    document.getElementById("polygon-modal").style.display = "none";
    pendingPath = null;
    measureTool.end(); // optional
  }

  function latLngToContainerPx(map, latLng) {
    const scale = Math.pow(2, map.getZoom());
    const nw = map.getBounds().getNorthEast();
    const worldCoordinateNW = map.getProjection().fromLatLngToPoint(nw);
    const worldCoordinate = map.getProjection().fromLatLngToPoint(latLng);
    const pixelOffset = new google.maps.Point(
      Math.floor((worldCoordinate.x - worldCoordinateNW.x) * scale),
      Math.floor((worldCoordinate.y - worldCoordinateNW.y) * scale)
    );
    return { x: pixelOffset.x, y: pixelOffset.y };
  }

  /* function showPolygonContextMenu(polygon, latLng) {
    selectedPolygon = polygon;
  
    const projection = map.getProjection();
    const scale = Math.pow(2, map.getZoom());
    const bounds = map.getBounds();
    const nw = bounds.getNorthEast();
    const worldNW = projection.fromLatLngToPoint(nw);
    const worldPoint = projection.fromLatLngToPoint(latLng);
  
    const x = (worldPoint.x - worldNW.x) * scale;
    const y = (worldPoint.y - worldNW.y) * scale;
  
    const menu = document.getElementById("polygon-menu");
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.style.display = "block";
  } */

    function showPolygonContextMenu(polygon, latLng, domEvent) {
      selectedPolygon = polygon;
    
      const menu = document.getElementById("polygon-menu");
    
      menu.style.left = `${domEvent.clientX}px`;
      menu.style.top = `${domEvent.clientY}px`;
      menu.style.display = "block";
    }
  
  function hidePolygonMenu() {
    document.getElementById("polygon-menu").style.display = "none";
  }
  
  function editPolygonGeometry() {
    polygonList.forEach(p => p.polygon.setEditable(false)); // hide handles on all others
  if (selectedPolygon) {
    selectedPolygon.setEditable(true);
  }
  hidePolygonMenu();
  }
  
  let editingPolygonMeta = null;

function editPolygonProperties() {
  //const meta = polygonList.find(p => p.polygon === selectedPolygon);
  const meta = findMetaByPolygon(selectedPolygon);
  if (!meta) return;

  editingPolygonMeta = meta;

  document.getElementById("poly-name").value = meta.name;
  document.getElementById("stroke-color").value = meta.style.strokeColor;
  document.getElementById("stroke-opacity").value = meta.style.strokeOpacity;
  document.getElementById("stroke-weight").value = meta.style.strokeWeight;
  document.getElementById("fill-color").value = meta.style.fillColor;
  document.getElementById("fill-opacity").value = meta.style.fillOpacity;

  pendingPath = selectedPolygon.getPath().getArray();
  document.getElementById("polygon-modal").style.display = "block";
  hidePolygonMenu();
}



document.addEventListener("click", hideContextMenu);
  