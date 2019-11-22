import React, { Component } from 'react';
import SearchComponent from './SearchComponent';

//redux
import { bindActionCreators } from 'redux';
import { actions as attributeActions } from '../redux/reducers/attributes';
import { actions as mapActions } from '../redux/reducers/map';

import { actions as filterActions } from '../redux/reducers/filters';
import { getColumnsFromFields, parseContractorData, parseDomainValues } from '../redux/selectors';
import{StoreContext} from "./StoreContext";
import { connect } from 'react-redux';

//, {PanelTitle,PanelText } 
import Panel, {
    PanelTitle,
    PanelText
  } from 'calcite-react/Panel'
import { CalciteTheme } from 'calcite-react/CalciteThemeProvider';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'

import Form, {
    FormControl,
    FormControlLabel
} from 'calcite-react/Form';
import TextField from 'calcite-react/TextField';

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";
//import Select from 'calcite-react/Select';
import styled from 'styled-components';
const Container = styled.div`
   max-width: 100%;
   height: 100%;
   overflow: scroll;
   display: flex;
   flex-direction: column;
`;

const makeDefaultState = (selected) => ({
    selectedContractor: selected,
    filtered: []
  });

class ContractorAttributes extends Component{
     constructor(props){
         super(props);
         this.state =  makeDefaultState(this.props.selectedContractor);
     }

     _handleSelectionEvent(val){
         console.log(val);
        this.props.setSelected (val, 'contractor')
     }
     _handleChangeEvent(val) {
        console.log("_handleChangeEvent val is: ", val.target);
        let stateCopy ={...this.props.selectedContractor};
        stateCopy[val.target.id] = val.target.value;
        // val['Contractor']
        // this.setState({          
        //     ..,
        //     contractor: this.props.selectedContractor['Contractor'] ? this.props.selectedContractor['Contractor'] : ""
        // });
        this.props.setSelected(stateCopy, 'contractors');
        this.setState({ 
            filtered: []
        });
        this._activateSaveButton();
        return val.target.value;
      }

      _activateSaveButton = (event) => {
        if (this.props.saveButton) {
            console.log("setSaveButton: ", this.props.saveButton, " \t event: ", event);
            this.props.setSaveButton();
            console.log("\t new prop: ", this.props.saveButton)
        }
    }


    _getAttribute(fld) {
        return this.props.selectedContractor[fld] ? this.props.selectedContractor[fld]: ''
    }

    componentDidUpdate(prevProps){
        console.log("component didupate(): \n\tprevProps.selectedContractor: ", prevProps.selectedContractor, "\n\tthis.props.selectedContractor: ", this.props.selectedContractor)
        if(prevProps.selectedContractor !== this.props.selectedContractor){
            console.log("setting component's state")
            this.setState({          
                selectedContractor: this.props.selectedContractor, 
                filtered: []
            });
        }
    }

    render() {
        var skipFields = [ "OBJECTID", "Comments", "Contractor_ID"];
        const filterCol = this.props.fields.filter (col => {
            return skipFields.indexOf(col.name) === -1;
        
        })

        const columns = filterCol.map((fld) => {
          //console.log(fld.name);
          var _filter =  fld.name.toUpperCase().indexOf("COST") > -1 ? false : true;
          return {Header: fld.name,  id: fld.name, accessor: fld.name, resizable: true, sortable: true, filterable: _filter, width: 155}
        })
        console.log("this.props.contractors: ", this.props.contractors);
        return (
            <Container/*  className="container-fluid, overflow-y overflow-x" */ style={{padding: "15px", backgroundColor: "transparent"}}>
                <Row >
                    <Col lg="12">
                        <FormControlLabel style={{ minWidth: '120px' }}>Select a Contractor</FormControlLabel>
                        <SearchComponent type='contractor' />
                    </Col>
                </Row>
                <Row className=" mt-2">
                    <Form horizontal style={{ flex: '1 1 100%' }}>
                        <Row style={{ flex: '1 1 100%' }}> 
                            <Panel style={{ flex: '1 1 100%', color: CalciteTheme.palette.darkBlue }}>
                                <PanelTitle style={{ textAlign: 'left' }}>Company Info.</PanelTitle>
                                <PanelText className="mx-2">
                                    <Row >
                                        <Col sm="4"  className="d-flex align-items-left" >
                                            <FormControl fullWidth>
                                                <FormControlLabel style={{ minWidth: '160px', textAlign: 'left', paddingLeft: '5' }}>Company Name</FormControlLabel>
                                                <TextField id="Contractor" value={this._getAttribute('Contractor')}
                                                    onChange={this._handleChangeEvent.bind(this)} fullWidth type="textarea"
                                                    style={{ resize: 'both', maxHeight: '100%', height: '36px' }}
                                                >
                                                </TextField>
                                            </FormControl>
                                        </Col>
                                        <Col sm="4" md="2" className="d-flex align-items-left">
                                            <FormControl >
                                                <FormControlLabel style={{ minWidth: '160px', textAlign: 'left', paddingLeft: '5' }}>Contractor ID</FormControlLabel>
                                                <TextField id="Contractor_ID" value={this._getAttribute('Contractor_ID')}
                                                    onChange={this._handleChangeEvent.bind(this)} fullWidth>
                                                </TextField>
                                            </FormControl>
                                        </Col>
                                    </Row>
                                    <Row className="mt-3">
                                        <Col sm="2" className="d-flex align-items-left">
                                            <FormControl >
                                                <FormControlLabel style={{ width: '120px', textAlign: 'left', paddingLeft: '3' }} >Main Number</FormControlLabel>
                                                <TextField id="Main_Number" value={this._getAttribute('Main_Number')}
                                                    onChange={this._handleChangeEvent.bind(this)} fullWidth>
                                                </TextField>
                                            </FormControl>
                                        </Col>
                                        <Col sm="10" className="d-flex align-items-left">
                                            <FormControl >
                                                <FormControlLabel style={{ width: '160px', textAlign: 'left', paddingLeft: '3' }}>Address</FormControlLabel>
                                                <TextField id="Address" value={this._getAttribute('Address')}
                                                    onChange={this._handleChangeEvent.bind(this)} fullWidth>
                                                </TextField>
                                            </FormControl>
                                            <FormControl >
                                                <FormControlLabel style={{ width: '80px', textAlign: 'left', paddingLeft: '1' }}>Suite</FormControlLabel>
                                                <TextField id="Suite" value={this._getAttribute('Suite')}
                                                    onChange={this._handleChangeEvent.bind(this)} fullWidth>
                                                </TextField>
                                            </FormControl>
                                            <FormControl >
                                                <FormControlLabel style={{ width: '80px', textAlign: 'left', paddingLeft: '1' }}>City</FormControlLabel>
                                                <TextField id="City" value={this._getAttribute('City')}
                                                    onChange={this._handleChangeEvent.bind(this)} fullWidth>
                                                </TextField>
                                            </FormControl>
                                            <FormControl >
                                                <FormControlLabel style={{ width: '80px', textAlign: 'left', paddingLeft: '1' }}>State</FormControlLabel>
                                                <TextField id="State" value={this._getAttribute('State')}
                                                    onChange={this._handleChangeEvent.bind(this)} fullWidth>
                                                </TextField>
                                            </FormControl>
                                            <FormControl >
                                                <FormControlLabel style={{ wdth: '80px', textAlign: 'left', paddingLeft: '1' }}>Zip</FormControlLabel>
                                                <TextField id="Zip" value={this._getAttribute('Zip')}
                                                    onChange={this._handleChangeEvent.bind(this)} fullWidth>
                                                </TextField>
                                            </FormControl>
                                        </Col>
                                    </Row>
                                </PanelText>
                            </Panel>
                        </Row>
                        <Row style={{ flex: '1 1 100%' }}>
                            <Panel style={{ flex: '1 1 100%' , color: CalciteTheme.palette.lightOrange}}>
                                <PanelTitle style={{ textAlign: 'left' }}>Contact Info.</PanelTitle>
                                <PanelText className="mx-2">
                                    <Row >
                                        <Col sm="6" md="4" className="d-flex align-items-left">
                                            <FormControl style={{ width: '70px'}}>
                                                <FormControlLabel style={{ minWidth: '100px', textAlign: 'left', paddingLeft: '1' }}>Honorific</FormControlLabel>
                                                <TextField id="Contact_NamePrefix" value={this._getAttribute('Contact_NamePrefix')}
                                                    onChange={this._handleChangeEvent.bind(this)} fullWidth>
                                                </TextField>
                                            </FormControl>
                                            <FormControl required>
                                                <FormControlLabel style={{ minWidth: '120px', textAlign: 'left', paddingLeft: '1' }}>First Name</FormControlLabel>
                                                <TextField id="Contact_FirstName" value={this._getAttribute('Contact_FirstName')}
                                                    onChange={this._handleChangeEvent.bind(this)} fullWidth>
                                                </TextField>
                                            </FormControl>
                                            <FormControl required>
                                                <FormControlLabel style={{ minWidth: '120px', textAlign: 'left', paddingLeft: '1' }}>Last Name</FormControlLabel>
                                                <TextField id="Contact_LastName" value={this._getAttribute('Contact_LastName')}
                                                    onChange={this._handleChangeEvent.bind(this)} fullWidth>
                                                </TextField>
                                            </FormControl>
                                        </Col>
                                        <Col sm="6" md="8" className="d-flex align-items-left">
                                            <FormControl >
                                                <FormControlLabel style={{ minWidth: '120px', textAlign: 'left', paddingLeft: '1' }}>Email</FormControlLabel>
                                                <TextField label="Email:" id="Contact_Email" value={this._getAttribute('Contact_Email')}
                                                    onChange={this._handleChangeEvent.bind(this)} fullWidth>
                                                </TextField>
                                            </FormControl>
                                            <FormControl >
                                                <FormControlLabel style={{ minWidth: '110px', textAlign: 'left', paddingLeft: '1' }}>Office Number</FormControlLabel>
                                                <TextField label="Email:" id="Contact_Number" value={this._getAttribute('Contact_Number')}
                                                    onChange={this._handleChangeEvent.bind(this)} fullWidth>
                                                </TextField>
                                            </FormControl>
                                            <FormControl >
                                                <FormControlLabel style={{ minWidth: '110px', textAlign: 'left', paddingLeft: '1' }}>Extension</FormControlLabel>
                                                <TextField label="Email:" id="Contact_Extension" value={this._getAttribute('Contact_Extension')}
                                                    onChange={this._handleChangeEvent.bind(this)} fullWidth>
                                                </TextField>
                                            </FormControl>
                                             <FormControl >
                                                <FormControlLabel style={{ minWidth: '110px', textAlign: 'left', paddingLeft: '1' }}>Cell</FormControlLabel>
                                                <TextField label="Email:" id="Contact_Cell" value={this._getAttribute('Contact_Cell')}
                                                    onChange={this._handleChangeEvent.bind(this)} fullWidth>
                                                </TextField>
                                            </FormControl>
                                        </Col>
                                    </Row>
                                    <Row >
                                        <Col sm="4" md="2" className="d-flex align-items-left" >
                                            <FormControl fullWidth>
                                                <FormControlLabel style={{ minWidth: '160px', textAlign: 'left', paddingLeft: '5' }}>Comments</FormControlLabel>
                                                <TextField id="Comments" value={this._getAttribute('Comments')}
                                                    onChange={this._handleChangeEvent.bind(this)} fullWidth type="textarea"
                                                    style={{ resize: 'both', maxHeight: '100%', height: '36px' }}
                                                >
                                                </TextField>
                                            </FormControl>
                                        </Col>
                                        </Row>
                                </PanelText>
                            </Panel>
                        </Row>
                    </Form>
                </Row>
                <Row style={{ flex: '1 1 100%' }}>
                    <ReactTable
                        defaultPageSize={this.props.contractors.length} 
                        className="-striped -highlight mt-5" 
                        columns={columns} data={this.props.contractors}
                        defaultFilterMethod={(filter, row) => {
                            const id = filter.pivotId || filter.id
                            return row[id] !== undefined ? String(row[id]).toUpperCase().indexOf(String(filter.value).toUpperCase()) > -1 : true
                        } }
                        showPagination={false} showPageSizeOptions={false} showPaginationBottom={false} 
                        minRows="0"
                        filterable
                        filtered={this.state.filtered}
                        
                        onFilteredChange={filtered => {
                            console.log("filtered: ", filtered)
                            this.setState({ filtered })
                        }}

                    getTdProps={(state, rowInfo, column, instance) => {
                        return {
                            onDoubleClick: (e, handleOriginal) => {
                                console.log('A Td Element was double clicked!')
                                //console.log('it produced this event:', e)
                                //console.log('It was in this column:', column)
                                console.log('It was in this row:', rowInfo)
                                //console.log('It was in this table instance:', instance)
                                this._handleSelectionEvent(rowInfo.original);
                                //this.props.selectFeature(rowInfo.original);
                                //this.props.setPanel("project_details")
                                // IMPORTANT! React-Table uses onClick internally to trigger
                                // events like expanding SubComponents and pivots.
                                // By default a custom 'onClick' handler will override this functionality.
                                // If you want to fire the original onClick handler, call the
                                // 'handleOriginal' function.
                                if (handleOriginal) {
                                    handleOriginal()
                                }
                            }
                        }
                    }}
                />
                </Row>
                
            </Container>
        )
    }
}

const mapStateToProps = state => ({
    contractors: parseContractorData(state),
    selectedContractor: state.attributes.selectedContractor,
    isVisible: state.map.attributesComponent,
    card: state.attributes.card,
    featureURLs: state.config.featureURLs,
    saveButton: state.attributes.saveButton,
    domains: parseDomainValues(state),
    optionsManagers: state.map.managers,
    fields: getColumnsFromFields(state, "contractors"),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        ...filterActions, ...mapActions, ...attributeActions
    }, dispatch);
}  

export default connect(mapStateToProps, mapDispatchToProps, null, {context:StoreContext}) (ContractorAttributes);