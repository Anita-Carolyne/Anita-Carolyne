
# Seasonal Forest Loss & Driver Attribution

![Project overview image](../assets/images/floods/monitorDashboard.png)

## 📌 Executive Summary

The Kenya Multi-Year & Custom Flood Monitor is an interactive Google Earth Engine (GEE) web application engineered for rapid spatial inundation assessment across Kenyan administrative boundaries (County and Ward levels). The core analytical workflow combines Synthetic Aperture Radar (SAR) backscatter analysis with digital elevation model (DEM) terrain constraints to isolate true flood inundation from permanent water bodies and low-backscatter urban artifacts. 
> Users can run flood comparisons across custom periods, dynamically visualize different administrative levels, and export results directly.

**Study Area:** Kenya
**Purpose:** _Research and Development_  
**Status:** In progress 

---

## 🛠️ Key Technical Highlights:
1. **Dual Spatial Scale:** Flexibility to run macroeconomic assessments at the County level or granular localized evaluations at the Ward level.

![UI computation image](../assets/images/floods/countyAnalysis.png)

2. **Weather-Independent Sensing:** By leveraging Sentinel-1 radar imagery, the tool pierces through cloud cover during extreme rainstorms—a major limitation of optical satellite sensors during active flood events.

3. **Automated Risk Validation:** Combines satellite radar data with ground topography to ensure reported flood zones reflect actual physical risk rather than satellite noise.

4. **GIS Ready:** Directly connects satellite analytics to downstream GIS tools like QGIS and ArcGIS by providing automated exports of GeoTIFF rasters and Shapefile vectors.

---

## Data Pipelines & Processing Workflow
1. **DSAR Inundation Detection:** Utilizes Sentinel-1 Ground Range Detected (GRD) C-band imagery (Interferometric Wide mode) acquired in dual-polarization. 
> Synthetic aperture backscatter thresholds define surface water presence across pre- and post-event temporal windows to map change detection over time.
2. **Topographic Vulnerability Refinement:** Integrates 30-meter USGS SRTM elevation data to calculate local slope gradients and lower 20th percentile elevation thresholds. 
> This terrain mask eliminates backscatter noise over flat, smooth non-water surfaces (e.g., asphalt, runways) and restricts false positives to topographically vulnerable lowlands.
3. **Spatial Aggregation & Area Analytics:** Exact flooded surface area is computed at 10-meter pixel resolution using ee.Image.pixelArea(). 
> Results are aggregated across the targeted geometry vector boundary using reduceRegion reducers and formatted asynchronously for dynamic UI updates.
![UI computation image](../assets/images/floods/wardSelection.png)
4. **User Interface & Output Generation:** Features asynchronous, non-blocking cascading dropdowns driven by .evaluate() callback chains to query feature collections dynamically.

---

## 💻 Earth Engine Workflow & Code Breakdown

Below are snippets of the Engine JavaScript code structured into functional blocks.

### Step 1: Pre-requisites

We first load our necessary datasets and establish visualization parameters.

```javascript
// =========================================================================
// Load Datasets, Establish the default geometry setup and Palettes
// =========================================================================
// Mount Kenya Peak Point (37.3083° E, 0.1521° S)
var mtKenyaPoint = ee.Geometry.Point([37.3083, -0.1521]);

var firmsCol = ee.ImageCollection("FIRMS");
var dwCol = ee.ImageCollection("GOOGLE/DYNAMICWORLD/V1");

// Visualization Palettes
var lossVis = {min: 1, max: 1, palette: ['red']};
var fireVis = {min: 1, max: 10, palette: ['yellow', 'orange', 'red']};
var manualVis = {min: 1, max: 1, palette: ['purple']};

```

### Step 2: Establish the core computation engine

Develop the core computation engine, defining all relevant functions and parameters.

```javascript
// =========================================================================
// Define your Core computation Engine
// =========================================================================
// 1. Create the buffer
// 2. Choose seasons (month range)
// 3. Etablish DW thresholds for before and after tree cover
// 4. Manipulate FIRMS data
```

### Step 3: Reactive UI & Export functionality

The interactive GUI allows users to select the buffer distance, season and comparison years. It then allows export of the data and loaded layers

```javascript
// Code snippet of loaded layers on Split-Panel UI
// --- ADD LAYERS TO LEFT MAP ---
  leftMap.addLayer(leftData.select('fire_count').selfMask(), fireVis, leftYear + ' Fire Count');
  leftMap.addLayer(leftData.select('fire_driven_loss'), lossVis, leftYear + ' Fire Loss');
  leftMap.addLayer(leftData.select('manual_clearing_loss'), manualVis, leftYear + ' Manual Loss');
  leftMap.addLayer(styledRoi, {}, 'ROI Buffer');

  // --- ADD LAYERS TO RIGHT MAP ---
  rightMap.addLayer(rightData.select('fire_count').selfMask(), fireVis, rightYear + ' Fire Count');
  rightMap.addLayer(rightData.select('fire_driven_loss'), lossVis, rightYear + ' Fire Loss');
  rightMap.addLayer(rightData.select('manual_clearing_loss'), manualVis, rightYear + ' Manual Loss');
  rightMap.addLayer(styledRoi, {}, 'ROI Buffer');
```

---

## 📊 Interactive Interface & Results Visualizer

> When executed in GEE, the web interface embeds custom UI controls on the left panel, updating the spatial layers and area metrics on-the-fly. 

![UI computation image](../assets/images/floods/wardAnalyzed.png)

---

## --- Summarized Logic steps

1. Data Ingestion & Filtering
> Load Sentinel-2 Dynamic World land cover probabilities and NASA FIRMS active fire datasets filtered by chosen seasonal date ranges.
2. Buffer & ROI Definition
> Buffer the target study area geometry based on your area of interest to establish the analytical boundary.
3. Canopy Loss Detection
> Identify pixels where forest probability drops below the defined baseline threshold between starting and ending timeframes.
4. Driver Classification
>Mask loss pixels intersecting FIRMS thermal anomalies as Fire-Driven Loss, classifying all non-intersecting loss pixels as Manual Clearing.
5. Spatial Reduction
> Compute zonal area statistics (`reduceRegion`) to calculate net hectare loss per driver category inside the buffer.
6. UI Rendering & Export
> Render styled raster overlays on the synchronized split-map and populate download links for CSV summary statistics and GeoTIFFs.

---

## --- Tools Used

| Tool | Purpose |
|------|---------|
| Google Earth Engine | Pre-processing, Analysis & Visualization |

---

## Primary Use Cases

1. **Routine Catchment Auditing:** Environmental agencies and conservation NGOs can execute _seasonal_ or _annual audits_ to track canopy health trends across specific forest blocks or community reserves.
2. **Post-Fire Damage & Clearance Assessments:** Disaster management units can _isolate wildfire scars_ from _clear-cutting_ to quantify burn severity, calculate total damaged hectares, and map recovery trajectories.
3. **Stakeholder Reporting & Open Access Data:** Researchers, decision-makers, and field teams can _instantly generate standardized CSV summary tables_ and download aligned spatial GeoTIFFs for further spatial analysis.

---

## 📈 Impact & Applications

1. **Targeted Conservation & Rapid Enforcement:** Distinguishing _active wildfire fronts_ from anthropogenic land clearing equips agency wardens (such as KFS and KWS) with actionable intelligence to _deploy targeted rapid-response teams_, _fight active blazes_, or _halt illegal logging operations_ in high-risk buffer zones.
2. **Protecting Water Tower Ecosystem Services:** As one of Kenya’s primary montane water towers, _safeguarding the Mount Kenya catchment_ directly maintains downstream hydrological regulation, reducing reservoir siltation for hydroelectric power and sustaining agricultural water security.
3. **Data-Driven Restoration & Policy:** Automated zonal reports provide _empirical metrics_ to guide _reforestation initiatives_, _evaluate community forest management (CFA) interventions_, and fulfill _international reporting obligations_ under frameworks like REDD+ and AFR100.

---

> Disclaimer: For a more accurate assessment, VHR satellite data or data obtained from KMD (Kenya Meteorological Department) is needed to accurately quantify flood behavior and impact.

## Links

[Go to User Interface](https://ee-anitacarolyne.projects.earthengine.app/view/flood-monitor){ .md-button }
[View Code on GitHub](https://anita-carolyne.github.io/Anita-Carolyne/){ .md-button }
