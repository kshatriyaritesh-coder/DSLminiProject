const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend")));

const cities = {
  Delhi: { lat: 28.6139, lng: 77.209 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Agra: { lat: 27.1767, lng: 78.0081 },
  Lucknow: { lat: 26.8467, lng: 80.9462 },
  Varanasi: { lat: 25.3176, lng: 82.9739 },
  Patna: { lat: 25.5941, lng: 85.1376 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
  Bhopal: { lat: 23.2599, lng: 77.4126 },
  Ahmedabad: { lat: 23.0225, lng: 72.5714 },
  Surat: { lat: 21.1702, lng: 72.8311 },
  Mumbai: { lat: 18.9401, lng: 72.8354 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Lonavala: { lat: 18.7557, lng: 73.4091 },
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
  Chennai: { lat: 13.0827, lng: 80.2707 }
};

const drivingEdges = [
  ["Delhi", "Jaipur", 281],
  ["Delhi", "Agra", 233],
  ["Delhi", "Lucknow", 555],
  ["Jaipur", "Agra", 240],
  ["Jaipur", "Ahmedabad", 664],
  ["Jaipur", "Bhopal", 600],
  ["Agra", "Lucknow", 337],
  ["Agra", "Bhopal", 465],
  ["Lucknow", "Varanasi", 286],
  ["Lucknow", "Patna", 528],
  ["Varanasi", "Patna", 246],
  ["Patna", "Kolkata", 581],
  ["Bhopal", "Ahmedabad", 521],
  ["Bhopal", "Hyderabad", 702],
  ["Bhopal", "Nagpur", 347],
  ["Ahmedabad", "Surat", 265],
  ["Ahmedabad", "Mumbai", 524],
  ["Surat", "Mumbai", 284],
  ["Mumbai", "Pune", 149],
  ["Mumbai", "Lonavala", 83],
  ["Lonavala", "Pune", 66],
  ["Mumbai", "Hyderabad", 711],
  ["Pune", "Hyderabad", 560],
  ["Pune", "Bengaluru", 840],
  ["Hyderabad", "Bengaluru", 574],
  ["Hyderabad", "Chennai", 625],
  ["Bengaluru", "Chennai", 346],
  ["Kolkata", "Varanasi", 650],
  ["Lucknow", "Bhopal", 510]
];

const trainEdges = [
  ["Delhi", "Agra", 200],
  ["Delhi", "Jaipur", 308],
  ["Delhi", "Lucknow", 512],
  ["Delhi", "Patna", 1000],
  ["Delhi", "Kolkata", 1450],
  ["Delhi", "Mumbai", 1385],
  ["Agra", "Varanasi", 500],
  ["Lucknow", "Varanasi", 270],
  ["Lucknow", "Patna", 510],
  ["Varanasi", "Patna", 230],
  ["Patna", "Kolkata", 550],
  ["Mumbai", "Pune", 192],
  ["Mumbai", "Ahmedabad", 491],
  ["Mumbai", "Hyderabad", 793],
  ["Mumbai", "Chennai", 1334],
  ["Ahmedabad", "Jaipur", 591],
  ["Ahmedabad", "Surat", 260],
  ["Pune", "Hyderabad", 664],
  ["Pune", "Bengaluru", 1165],
  ["Hyderabad", "Bengaluru", 794],
  ["Hyderabad", "Chennai", 796],
  ["Bengaluru", "Chennai", 362],
  ["Kolkata", "Bhopal", 1430],
  ["Bhopal", "Hyderabad", 864],
  ["Jaipur", "Bhopal", 703]
];

const flightHubs = [
  "Delhi", "Mumbai", "Bengaluru", "Chennai", "Kolkata",
  "Hyderabad", "Ahmedabad", "Pune", "Jaipur", "Lucknow",
  "Patna", "Bhopal"
];

const flightEdges = [
  ["Delhi", "Mumbai", 1148],
  ["Delhi", "Bengaluru", 1740],
  ["Delhi", "Chennai", 2179],
  ["Delhi", "Kolkata", 1305],
  ["Delhi", "Hyderabad", 1492],
  ["Delhi", "Ahmedabad", 887],
  ["Delhi", "Pune", 1409],
  ["Delhi", "Jaipur", 263],
  ["Delhi", "Lucknow", 497],
  ["Delhi", "Patna", 1000],
  ["Delhi", "Bhopal", 700],
  ["Mumbai", "Bengaluru", 980],
  ["Mumbai", "Chennai", 1338],
  ["Mumbai", "Kolkata", 1654],
  ["Mumbai", "Hyderabad", 619],
  ["Mumbai", "Ahmedabad", 524],
  ["Mumbai", "Pune", 149],
  ["Bengaluru", "Chennai", 346],
  ["Bengaluru", "Hyderabad", 574],
  ["Bengaluru", "Kolkata", 1871],
  ["Bengaluru", "Pune", 840],
  ["Chennai", "Hyderabad", 625],
  ["Chennai", "Kolkata", 1659],
  ["Kolkata", "Patna", 550],
  ["Hyderabad", "Ahmedabad", 1100],
  ["Hyderabad", "Pune", 560],
  ["Ahmedabad", "Jaipur", 664],
  ["Jaipur", "Lucknow", 600],
  ["Lucknow", "Patna", 528],
  ["Patna", "Bhopal", 1000],
  ["Bhopal", "Hyderabad", 702]
];

function buildGraph(edges) {
  var graph = {};
  for (var c in cities) {
    graph[c] = [];
  }
  for (var i = 0; i < edges.length; i++) {
    var a = edges[i][0];
    var b = edges[i][1];
    var d = edges[i][2];
    if (graph[a] && graph[b]) {
      graph[a].push({ city: b, dist: d });
      graph[b].push({ city: a, dist: d });
    }
  }
  return graph;
}

var graphs = {
  driving: buildGraph(drivingEdges),
  walking: buildGraph(drivingEdges),
  train: buildGraph(trainEdges),
  flight: buildGraph(flightEdges)
};

var speeds = {
  driving: 60,
  walking: 5,
  train: 70,
  flight: 700
};

function getConnections(mode) {
  var source;
  if (mode === "driving" || mode === "walking") source = drivingEdges;
  else if (mode === "train") source = trainEdges;
  else source = flightEdges;
  var list = [];
  for (var i = 0; i < source.length; i++) {
    list.push({ from: source[i][0], to: source[i][1], dist: source[i][2] });
  }
  return list;
}

class MinHeap {
  constructor() {
    this.heap = [];
  }
  push(item) {
    this.heap.push(item);
    this._bubbleUp(this.heap.length - 1);
  }
  pop() {
    var top = this.heap[0];
    var last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._sinkDown(0);
    }
    return top;
  }
  _bubbleUp(i) {
    while (i > 0) {
      var parent = Math.floor((i - 1) / 2);
      if (this.heap[parent].cost > this.heap[i].cost) {
        var tmp = this.heap[parent];
        this.heap[parent] = this.heap[i];
        this.heap[i] = tmp;
        i = parent;
      } else {
        break;
      }
    }
  }
  _sinkDown(i) {
    var n = this.heap.length;
    while (true) {
      var left = 2 * i + 1;
      var right = 2 * i + 2;
      var smallest = i;
      if (left < n && this.heap[left].cost < this.heap[smallest].cost) {
        smallest = left;
      }
      if (right < n && this.heap[right].cost < this.heap[smallest].cost) {
        smallest = right;
      }
      if (smallest !== i) {
        var tmp = this.heap[smallest];
        this.heap[smallest] = this.heap[i];
        this.heap[i] = tmp;
        i = smallest;
      } else {
        break;
      }
    }
  }
  isEmpty() {
    return this.heap.length === 0;
  }
}

function dijkstra(graph, start, end, closedSet, optimizeBy, mode) {
  var dist = {};
  var prev = {};
  var visited = {};
  for (var c in graph) {
    dist[c] = Infinity;
    prev[c] = null;
  }
  dist[start] = 0;
  var pq = new MinHeap();
  pq.push({ cost: 0, city: start });
  while (!pq.isEmpty()) {
    var current = pq.pop();
    var u = current.city;
    if (visited[u]) continue;
    visited[u] = true;
    if (end && u === end) break;
    var neighbors = graph[u];
    for (var i = 0; i < neighbors.length; i++) {
      var v = neighbors[i].city;
      var d = neighbors[i].dist;
      var key1 = u + "|" + v;
      var key2 = v + "|" + u;
      if (closedSet && (closedSet[key1] || closedSet[key2])) continue;
      var weight = d;
      if (optimizeBy === "time") {
        weight = d / speeds[mode];
      }
      var newDist = dist[u] + weight;
      if (newDist < dist[v]) {
        dist[v] = newDist;
        prev[v] = u;
        pq.push({ cost: newDist, city: v });
      }
    }
  }
  return { dist, prev };
}

function buildPath(prev, start, end) {
  if (prev[end] === null && end !== start) return null;
  var path = [];
  var cur = end;
  while (cur !== null) {
    path.unshift(cur);
    cur = prev[cur];
  }
  if (path[0] !== start) return null;
  return path;
}

function pathDistance(path, graph) {
  var total = 0;
  for (var i = 0; i < path.length - 1; i++) {
    var a = path[i];
    var b = path[i + 1];
    var neighbors = graph[a];
    for (var j = 0; j < neighbors.length; j++) {
      if (neighbors[j].city === b) {
        total += neighbors[j].dist;
        break;
      }
    }
  }
  return total;
}

function formatTime(hours, mode) {
  if (mode === "walking") {
    var days = Math.floor(hours / 24);
    var rem = (hours % 24).toFixed(1);
    if (days > 0) return days + "d " + rem + "h";
    return rem + "h";
  }
  var h = Math.floor(hours);
  var m = Math.round((hours - h) * 60);
  return h + "h " + m + "m";
}

function buildClosedSet(closedConnections) {
  var set = {};
  if (!closedConnections || !closedConnections.length) return set;
  for (var i = 0; i < closedConnections.length; i++) {
    var key = closedConnections[i].from + "|" + closedConnections[i].to;
    var key2 = closedConnections[i].to + "|" + closedConnections[i].from;
    set[key] = true;
    set[key2] = true;
  }
  return set;
}

app.get("/api/cities", (req, res) => {
  var list = [];
  for (var c in cities) {
    list.push({ name: c, lat: cities[c].lat, lng: cities[c].lng });
  }
  res.json(list);
});

app.get("/api/connections", (req, res) => {
  var mode = req.query.mode || "driving";
  res.json(getConnections(mode));
});

const routeGeometryCache = new Map();

app.get("/api/route-geometry", async (req, res) => {
  try {
    const { coords, mode } = req.query;
    if (!coords) return res.status(400).json({ error: "Coordinates required" });
    const profile = mode === "walking" ? "walking" : "driving";
    const cacheKey = `${profile}:${coords}`;
    if (routeGeometryCache.has(cacheKey)) {
      return res.json(routeGeometryCache.get(cacheKey));
    }
    const url = `https://router.project-osrm.org/route/v1/${profile}/${coords}?overview=full&geometries=geojson`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("OSRM returned status " + response.status);
    const data = await response.json();
    if (data.code === "Ok" && data.routes && data.routes.length > 0) {
      const result = {
        code: "Ok",
        coordinates: data.routes[0].geometry.coordinates.map(pt => [pt[1], pt[0]]),
        distance: Math.round(data.routes[0].distance / 1000),
        duration: Math.round(data.routes[0].duration / 60)
      };
      routeGeometryCache.set(cacheKey, result);
      return res.json(result);
    }
    return res.status(404).json({ error: "No route found" });
  } catch (err) {
    return res.status(502).json({ error: "Failed to fetch road geometry", details: err.message });
  }
});


app.post("/api/shortest-path", (req, res) => {
  var source = req.body.source;
  var destination = req.body.destination;
  var mode = req.body.mode || "driving";
  var optimizeBy = req.body.optimizeBy || "distance";
  var closedConnections = req.body.closedConnections || [];

  if (!source || !destination) {
    return res.status(400).json({ error: "Source and destination required." });
  }
  if (source === destination) {
    return res.status(400).json({ error: "Source and destination must be different." });
  }
  if (!cities[source] || !cities[destination]) {
    return res.status(400).json({ error: "Invalid city name." });
  }
  if (mode === "flight" && (!flightHubs.includes(source) || !flightHubs.includes(destination))) {
    return res.status(400).json({ error: "One or both cities do not have an airport hub for flights." });
  }
  if (mode === "train") {
    var trainCities = {};
    for (var i = 0; i < trainEdges.length; i++) {
      trainCities[trainEdges[i][0]] = true;
      trainCities[trainEdges[i][1]] = true;
    }
    if (!trainCities[source] || !trainCities[destination]) {
      return res.status(400).json({ error: "One or both cities do not have a railway connection." });
    }
  }

  var graph = graphs[mode];
  var closedSet = buildClosedSet(closedConnections);
  var result = dijkstra(graph, source, destination, closedSet, optimizeBy, mode);
  var path = buildPath(result.prev, source, destination);
  if (!path) {
    return res.status(404).json({ error: "No path found between selected cities for this mode." });
  }
  var totalDist = pathDistance(path, graph);
  var totalTime = totalDist / speeds[mode];
  res.json({
    path: path,
    totalDistance: Math.round(totalDist),
    totalTime: formatTime(totalTime, mode),
    totalTimeHours: totalTime
  });
});

app.post("/api/reachable", (req, res) => {
  var source = req.body.source;
  var mode = req.body.mode || "driving";
  var budget = parseFloat(req.body.budget) || 0;
  var budgetType = req.body.budgetType || "distance";
  var closedConnections = req.body.closedConnections || [];

  if (!source || !cities[source]) {
    return res.status(400).json({ error: "Invalid source city." });
  }

  var graph = graphs[mode];
  var closedSet = buildClosedSet(closedConnections);
  var optimizeBy = budgetType === "time" ? "time" : "distance";
  var result = dijkstra(graph, source, null, closedSet, optimizeBy, mode);

  var reachable = [];
  for (var city in result.dist) {
    if (city === source) continue;
    var cost = result.dist[city];
    if (cost === Infinity) continue;
    var distKm, timeHours;
    if (budgetType === "time") {
      timeHours = cost;
      distKm = timeHours * speeds[mode];
      if (timeHours > budget) continue;
    } else {
      distKm = cost;
      timeHours = distKm / speeds[mode];
      if (distKm > budget) continue;
    }
    var path = buildPath(result.prev, source, city);
    reachable.push({
      city: city,
      distance: Math.round(distKm),
      time: formatTime(timeHours, mode),
      timeHours: timeHours,
      path: path
    });
  }

  reachable.sort(function(a, b) { return a.distance - b.distance; });
  res.json({ reachable });
});

app.post("/api/trip-optimizer", (req, res) => {
  var start = req.body.start;
  var cities_to_visit = req.body.cities || [];
  var mode = req.body.mode || "driving";
  var optimizeBy = req.body.optimizeBy || "distance";
  var closedConnections = req.body.closedConnections || [];

  if (!start || !cities[start]) {
    return res.status(400).json({ error: "Invalid start city." });
  }
  if (cities_to_visit.length < 1 || cities_to_visit.length > 5) {
    return res.status(400).json({ error: "Select between 1 and 5 cities to visit." });
  }

  var graph = graphs[mode];
  var closedSet = buildClosedSet(closedConnections);
  var allNodes = [start].concat(cities_to_visit);
  var pairDist = {};
  var pairPath = {};

  for (var i = 0; i < allNodes.length; i++) {
    var from = allNodes[i];
    var result = dijkstra(graph, from, null, closedSet, optimizeBy, mode);
    for (var j = 0; j < allNodes.length; j++) {
      var to = allNodes[j];
      if (from === to) continue;
      var key = from + "|" + to;
      pairDist[key] = result.dist[to];
      pairPath[key] = buildPath(result.prev, from, to);
    }
  }

  function permutations(arr) {
    if (arr.length <= 1) return [arr];
    var result = [];
    for (var i = 0; i < arr.length; i++) {
      var rest = arr.slice(0, i).concat(arr.slice(i + 1));
      var perms = permutations(rest);
      for (var j = 0; j < perms.length; j++) {
        result.push([arr[i]].concat(perms[j]));
      }
    }
    return result;
  }

  var allOrders = permutations(cities_to_visit);
  var bestCost = Infinity;
  var bestOrder = null;

  for (var p = 0; p < allOrders.length; p++) {
    var order = allOrders[p];
    var total = 0;
    var valid = true;
    var current = start;
    for (var q = 0; q < order.length; q++) {
      var next = order[q];
      var k = current + "|" + next;
      if (pairDist[k] === Infinity || !pairPath[k]) {
        valid = false;
        break;
      }
      total += pairDist[k];
      current = next;
    }
    if (valid && total < bestCost) {
      bestCost = total;
      bestOrder = order;
    }
  }

  if (!bestOrder) {
    return res.status(404).json({ error: "No valid trip found. Some cities may be unreachable." });
  }

  var segments = [];
  var fullPath = [start];
  var totalDistKm = 0;
  var cur = start;
  for (var s = 0; s < bestOrder.length; s++) {
    var nxt = bestOrder[s];
    var seg = pairPath[cur + "|" + nxt];
    if (!seg) {
      return res.status(404).json({ error: "Could not build full path." });
    }
    segments.push({ from: cur, to: nxt, path: seg });
    for (var t = 1; t < seg.length; t++) {
      fullPath.push(seg[t]);
    }
    totalDistKm += pathDistance(seg, graph);
    cur = nxt;
  }

  var totalTime = totalDistKm / speeds[mode];
  res.json({
    bestOrder: [start].concat(bestOrder),
    totalDistance: Math.round(totalDistKm),
    totalTime: formatTime(totalTime, mode),
    segments: segments,
    fullPath: fullPath
  });
});

app.listen(5000, () => {
  console.log("City Route Planner backend running on port 5000");
  console.log("Open the app at: http://localhost:5000");
});
