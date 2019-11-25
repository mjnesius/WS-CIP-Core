// Based on Esri's esri-react-boot template.​

// NOTE
// This is a "special" react component that does not strictly play by
// React's rules.
//
// Conceptually, this component creates a "portal" in React by
// closing its render method off from updates (by simply rendering a div and
// never accepting re-renders) then reconnecting itself to the React lifecycle
// by listening for any new props (using componentWillReceiveProps)

// React
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// Redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as mapActions } from '../../../redux/reducers/map';
import { actions as filterActions } from '../../../redux/reducers/filters';
import { actions as attributeActions } from '../../../redux/reducers/attributes';
import {StoreContext} from '../../StoreContext';
// ESRI
import { loadModules } from 'esri-loader';
import { createView } from '../../../utils/esriHelper';

// Styled Components
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import TableIcon from 'calcite-ui-icons-react/TableIcon';
const Container = styled.div`
  height: 100%;
  width: 100%;
`;


// Variables
const containerID = "map-view-container";
var openDetailsAction = {
  title: "Edit Details",
  id: "edit-details",
  className: "esri-icon-table"
};
var popupEditorAction = {
  title: "Edit Popup",
  id: "edit-popup",
  className: "esri-icon-edit"
};

var actionsButtons = [openDetailsAction, popupEditorAction]




class Map extends Component {
   constructor (props) {
     super(props);
     //set this binding to the class; note: arrow functions do not have their own context
     this.setupEventHandlers = this.setupEventHandlers.bind(this);//executeIdentifyTask
     this.executeIdentifyTask = this.executeIdentifyTask.bind(this);//showPopup
     this.showPopup = this.showPopup.bind(this);
     console.log(this.props);
  }

  componentDidMount() {
    this.startup(
      this.props.mapConfig,
      containerID,
      this.props.is3DScene
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Tell React to never update this component, that's up to us
    return true;
  }
  componentDidUpdate(){
    console.log(" this.props.defExp:   ", this.props.defExp);
    
    // refactor to set the filter using a Saga that calls a Map action creator
    if (this.props.fields.length > 1) {
      var lyrIndex = this.map.layers.findIndex(function(lyr){
        //console.log("lyr.id: ", lyr.id);
        return lyr.id === "projects";
      });
      var lyr = this.map.layers.getItemAt(lyrIndex);
      //console.log(lyr.definitionExpression, " vs ", this.props.defExp)
      if (!(lyr.definitionExpression === this.props.defExp)) {
        lyr.definitionExpression = this.props.defExp;
        var query = lyr.createQuery();
        query.returnGeometry = true;
        query.where =this.props.defExp ? this.props.defExp : "1=1";
        lyr.queryFeatures(query).then((response) => {
          var repObj = response.toJSON();
          console.log("getFeatures json: ", repObj)
          this.props.setFeatures(repObj.features);
          this.props.setFields(lyr.fields);
        })
      }
     }
  }
  

  // ESRI JSAPI
  startup = (mapConfig, node, isScene = false) => {
    createView(mapConfig, node, isScene).then(
      response => {
        this.init(response);
        this.setupWidgetsAndLayers();
        this.finishedLoading();
        this.setupEventHandlers(this.view, this.map);
      },
      error => {
        console.error("map err in createView/startup", error);
        window.setTimeout( () => {
          this.startup(mapConfig, node);
        }, 1000);
      })
  }

  finishedLoading = () => {
    // Update app state only after map and widgets are loaded
    this.props.onMapLoaded();
    
  }

  init = (response) => {
    this.view = response.view
    this.map = response.view.map;
  }

  setupWidgetsAndLayers = () => {
    loadModules(['esri/layers/FeatureLayer','esri/widgets/Editor', 'esri/widgets/Expand',
    'esri/widgets/BasemapGallery', 'esri/widgets/LayerList'
    ])
    .then( ([ FeatureLayer, Editor, Expand, BasemapGallery, LayerList
    ], containerNode) => {
      var popTemplate = {
        title: "Water-Sewer CIP",
        content: [{
          type: "fields",
          fieldInfos: [{
            fieldName: "Project_Name",
            label: "Project Name"
          }, {
            fieldName: "Project_Type",
            label: "Project Type"
          },{
            fieldName: "Status",
            label: "Status"
          },{
            fieldName: "Project_Manager",
            label: "Project Manager"
          },{
            fieldName: "Proposed_Year",
            label: "Proposed Year"
          },{
            fieldName: "Contractor",
            label: "Contractor"
          },{
            fieldName: "Inspector",
            label: "Inspector"
          },{
            fieldName: "Contact",
            label: "Contact"
          }
          ]
        }],
        actions: actionsButtons,
        overwriteActions: true
      }
      const featureLayer = new FeatureLayer({
        outFields: ["*"],
        url: this.props.config.featureURLs[0],
        title: "WaterSewerPM",
        id: "projects",
        refreshInterval: 0.1,
        popupTemplate: popTemplate
      });

      //map and view are saved as a component reference during init, so use 'this'
      this.map.add(featureLayer);

      var basemapGallery  = new BasemapGallery({
        view: this.view
      });

      var expandBasemap = new Expand({
        expandIconClass: "esri-icon-basemap",
        view: this.view,
        content: basemapGallery,
        expandTooltip: "Expand Basemap Gallery"
      });

      this.view.ui.add(expandBasemap, {position :"top-right"});

      var expandLegend = new Expand({
        expandIconClass: "esri-icon-layers",
        view: this.view,
        content: new LayerList({
            view: this.view
          }),
        expandTooltip: "Expand Legend"
      });

      this.view.ui.add(expandLegend, {position :"top-right"});

      const editor = new Editor({
        view: this.view,
        container: containerNode,
        id: "editor",
        layerInfos: [{
          layer: featureLayer,
          fieldConfig: [{
              name: "Project_Name",
              label: "Project Name"
            }, {
              name: "Project_Type",
              label: "Project Type"
            }, {
              name: "Status",
              label: "Status"
            }, {
              name: "Project_Manager",
              label: "Project Manager"
            }, {
              name: "Proposed_Year",
              label: "Proposed Year"
            }, {
              name: "Contractor",
              label: "Contractor"
            }, {
              name: "Inspector",
              label: "Inspector"
            }, {
              name: "Contact",
              label: "Contact"
            }
          ],
          enabled:true,
          addEnabled: true,
          updateEnabled: true,
          deleteEnabled: true
        }]
      });
      this.editor = editor;

      var expandEditor = new Expand({
        expandIconClass: "esri-icon-edit",
        view: this.view,
        content: editor,
        expandTooltip: "Expand Edit Widget",
        id: "editorExpand"
      });
      this.expandEditor = expandEditor;
      
      this.view.ui.add(expandEditor, "top-right"); 
      const renderTooltip = props => (
        <div
          {...props}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 1)',
            padding: '2px 5px',
            color: 'black',
            borderRadius: 1,
            borderStyle: 'solid',
            borderWidth: 1,
            fontFamily: 'Times New Roman',
            fontSize:12,
            ...props.style,
          }}
        >
          Launch Attribute Panel
        </div>
      );

      const butt = <OverlayTrigger
        placement="bottom-start"
        delay={{ show: 250, hide: 200 }}
        overlay={renderTooltip}>
          <Button as="div" size="sm" variant="light"
            onClick={() => this.props.toggleAttributes()}>
            <TableIcon size={16} filled />
          </Button>
        </OverlayTrigger>;

      var btn = document.createElement("div");
      btn.setAttribute("id", "projectAttributes");
      this.view.ui.add(btn, "top-right");
      ReactDOM.render(butt, document.getElementById("projectAttributes"));
      
      featureLayer.when(function() {
        //featureLayer.definitionExpression = createDefinitionExpression("");
        zoomToLayer(featureLayer);
        getFeatures(featureLayer);
        this.featureLayer = featureLayer;  
        
      });

      featureLayer.on("edits",  function(event) {
        const extractObjectId = function(result) {
          return result.objectId;
        };
      
        const adds = event.addedFeatures.map(extractObjectId);
        console.log("addedFeatures: ", adds.length, adds);
      
        const updates = event.updatedFeatures.map(extractObjectId);
        console.log("updatedFeatures: ", updates.length, updates);
      
        const deletes = event.deletedFeatures.map(extractObjectId);
        console.log("deletedFeatures: ", deletes.length, deletes);
        getFeatures(featureLayer);
      });
      
      const zoomToLayer = (layer) => {
        return layer.queryExtent()
          .then((response) => {
            this.view.goTo(response.extent);
          });
      }
    
      const getFeatures = (layer) => {
        var query = layer.createQuery();
        query.returnGeometry = true;
        query.where = this.props.map.defExp ? this.props.map.defExp : "1=1"
        return layer.queryFeatures(query)
          .then((response) => {
            var repObj = response.toJSON();
            console.log("getFeatures json: ", repObj)
            this.props.setFeatures(repObj.features);
            this.props.setFields(layer.fields);
            this.props.getEmployees(this.props.config.employeesURL);
            this.props.getContractors(this.props.config.contractorsURL);
          }).then((res) => {
        });
      }
      
      //
      // JSAPI Map Widgets and Layers get loaded here!
      //

    });
  }

   showPopup = (response) => {
     console.log("showpopup")
    // features: response,
    //     location: event.mapPoint
    console.log("showPopup(response): ", response);

    if(this.view.popup.features.length > 0 && response.length > 0){
      this.view.popup.open({
        features : [...this.view.popup.features,...response],
        featureNavigationEnabled : true,
        defaultPopupTemplateEnabled: true,
        dockEnabled : true,
        highlightEnabled: true
      })
    }
    else if (response.length > 0) {
      this.view.popup.open({
        features : response,
        featureNavigationEnabled : true,
        defaultPopupTemplateEnabled: true,
        dockEnabled : true,
        highlightEnabled: true
      })
    } 
    document.getElementById("map-view-container").style.cursor = "default";
  }

  executeIdentifyTask = (event) => {
    loadModules(['esri/tasks/IdentifyTask',
      'esri/tasks/support/IdentifyParameters', 'esri/tasks/GeometryService',
      'esri/tasks/support/ProjectParameters', 'esri/geometry/SpatialReference'
    ])
      .then(([IdentifyTask, IdentifyParameters, GeometryService, ProjectParameters, SpatialReference
      ]) => {
        var identifyTask, idParams;
        // Create identify task for the specified map service
        identifyTask = new IdentifyTask(this.props.config.identifyURL[0]);

        // Set the parameters for the Identify
        idParams = new IdentifyParameters();
        idParams.tolerance = 3;
        idParams.layerOption = "visible";
        const vizLayerIDs = [];
        // build layer ID list (they're nested sublayers, so it won't work automatically)
        this.view.allLayerViews.forEach(vw => {
          console.log("checking layer: " + vw.layer.title);
          if (vw.layer.title === "COT Inter CityworksAllActive D SP") {
            const subLayers = vw.layer.sublayers;
            if (vw.visible & subLayers.length > 0) {
              console.log("checking " + subLayers.length + " sublayers for: " + vw.layer.title );
              subLayers.forEach(lyr => {
                
                const subLayers2 = lyr.sublayers;
                if (!lyr.visible) {/* skip */}
                else if (lyr.visible && !subLayers2){
                  console.log("adding id: " + lyr.id + " for layer: " + lyr.title );
                  vizLayerIDs.push(lyr.id);
                }
                else if (lyr.visible && subLayers2){
                  console.log("checking " + subLayers2.length + " sublayers for: " + lyr.title );
                  subLayers2.forEach(lyr => {
                    const subLayers3 = lyr.sublayers;
                    if (!lyr.visible) {/* skip */}
                    else if (lyr.visible && !subLayers3){
                      console.log("adding id: " + lyr.id + " for layer: " + lyr.title );
                      vizLayerIDs.push(lyr.id);
                    }
                    else if (lyr.visible && subLayers3 ){
                      subLayers3.forEach(lyr => {
                        const subLayers4 = lyr.sublayers;
                        console.log("checking " + subLayers4.length + " sublayers for: " + lyr.title );
                        if (lyr.visible && subLayers4.length < 1){
                          console.log("adding id: " + lyr.id + " for layer: " + lyr.title );
                          vizLayerIDs.push(lyr.id);
                        }
                      })
                    }
                  })
                }
              })
            }
          }

        });
        // idParams.layerIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
        //   25, 26, 27, 28, 29, 31, 33, 34, 36, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
        //   49, 50, 51, 52, 53, 54, 55, 56, 58, 59, 60, 61, 62, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74,
        //   75, 76, 77, 78, 79, 80, 81, 82, 83];
        console.log("vizLayerIDs: " + vizLayerIDs);
        idParams.layerIds = vizLayerIDs;
        idParams.width = this.view.width;
        idParams.height = this.view.height;
        idParams.returnGeometry = true;
        // Set the geometry to the location of the view click
        console.log("event: ", event, " url: ", this.props.config.identifyURL[0])
        console.log("mapPoint: ", event.mapPoint);

        document.getElementById("map-view-container").style.cursor = "wait";
        idParams.geometry = event.mapPoint;
        idParams.mapExtent = this.view.extent;
        identifyTask
          .execute(idParams)
          .then(response => {

            var results = response.results;

            console.log("results.length: " + results.length + ", results: " + results);

            return results.map(function (result) {
              var feature = result.feature;
              var layerName = result.layerName;
              console.log("feature.attributes: ", feature.attributes);
              feature.attributes.layerName = layerName;
              var fieldInfos = [];
              for (var k in feature.attributes) {
                fieldInfos.push({
                  fieldName: k
                })
              }
              console.log(fieldInfos)
              feature.popupTemplate = {
                // autocasts as new PopupTemplate()
                title: layerName,
                content: [{
                  type: "fields",
                  fieldInfos: fieldInfos
                }],
                outFields: ["*"],
                highlightEnabled: true
              }

              return feature;
            })
        }).then(this.showPopup);
      })
  }

  setupEventHandlers = (view, map) => {
    
    console.log("setupEventHandlers()\tprops\t", this.props);
    view.on("click", this.executeIdentifyTask);

    view.popup.on("trigger-action",  (event) => {
      console.log(event);
      console.log(event.action);
      if (event.action.id === "edit-popup") {
        if (!this.editor.viewModel.activeWorkFlow) {
          this.view.popup.visible = false;
          // Call the Editor update feature edit workflow
          this.expandEditor.expand();
          this.editor.startUpdateWorkflowAtFeatureEdit(
            this.view.popup.selectedFeature
          );
          this.view.popup.spinnerEnabled = false;
        }
      }

      if (event.action.id === "edit-details") {
        this.props.toggleAttributes();
        var selected = {};
        selected['feature'] = view.popup.selectedFeature['attributes'];
        this.props.selectFeature(selected['feature']);
        this.props.setPanel("project_details");
      }
    });

    //
    // JSAPI Map Event Handlers go here!
    //
  }
  
  render() {
    return (
        <Container ref="mapDiv" id={containerID}/>
    );
  }
}

//this function defines which data from the redux store this connected component needs
const mapStateToProps = state => ({
  config: state.config,
  map: state.map,
  //featureLayer: state.map.featureLayer,
  defExp: state.filter.defExp,
  selectedYear: state.filter.selectedYear,
  selectedStatus: state.filter.selectedStatus,
  selectedManager: state.filter.selectedManager,
  fields: state.map.fields
});

const mapDispatchToProps = function (dispatch) {
  return bindActionCreators({
    ...mapActions, ...filterActions, ...attributeActions
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps, null, {context:StoreContext}) (Map);
//export default connect(mapStateToProps, mapDispatchToProps) (Map);
