import _ from 'underscore';

import React from "react";
import moment from 'moment';
import SearchComponent from './SearchComponent';

import { bindActionCreators } from 'redux';
import { actions as attributeActions } from '../redux/reducers/attributes';
import { actions as mapActions } from '../redux/reducers/map';

import{StoreContext} from "./StoreContext";
import { connect } from 'react-redux';
import {parseDomainValues, parseProjectData, parseEmployeesData, parseContractorData} from '../redux/selectors';

//import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'

import formValidator from '../utils/formValidator';
import validationRules from '../utils/validationRules';

import DatePicker from 'calcite-react/DatePicker'
import Form, {
    FormControl,
    FormControlLabel, FormHelperText
} from 'calcite-react/Form';

//import {FormControl as BootstrapFormControl}  from 'react-bootstrap/FormControl';
// , { PanelTitle, PanelText } 
import { ThemeContext } from 'styled-components';
import { CalciteTheme } from 'calcite-react/CalciteThemeProvider';
//import Panel from 'calcite-react/Panel';
import { MenuItem } from 'calcite-react/Menu';
import TextField from 'calcite-react/TextField';
import Select from 'calcite-react/Select';
import Checkbox from 'calcite-react/Checkbox';
import Card, {
    CardTitle,
    CardContent
  } from 'calcite-react/Card'
//import Card from 'react-bootstrap/Card';

import styled from 'styled-components';
const StyledProjectLabel = styled(FormControlLabel)`
    color: black;
    text-shadow: 0px 0px 2px white;
    font-weight: bolder;
    margin: 0;
    padding: 0;
    margin-left: 1;
    margin-right: 2;
    min-width: 100px !important;
    max-width: 100px !important;
    text-align: left;
  `;
 const StyledFormControl = styled(FormControl)`
    width: 98%;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center !important;
    justify-content: space-between !important;
`;
const StyledSelect = styled(Select)`
    width: 98%;
    margin: 0;
    padding: 0;
    margin-left: 2;
`;
const StyledDatePicker = styled(DatePicker)`
    width: 95% !important;
    margin: 0;
    padding: 0;
    margin-left: 2;
`;
//import styled from 'styled-components';
// const Container = styled.div`
//   display: inline-flex;
//   flex-direction: rtl;
//   width: 100%;
//   height: 100%;
//   flex-grow: 2;
//   class-name: container-fluid
// `;

class ProjectDetails extends React.Component {
    constructor(props) {
        super();
        // TO-DO refactor to use Redux state
        this.validator = new formValidator(validationRules);
        this.state = {/* 
            Let_Date: null,
            PreBid_Date: null,
            BidOpening_Date: null,
            PreCon_Date: null, */
            Let_DatePicker: false, 
            PreBid_DatePicker: false,
            BidOpening_DatePicker: false, 
            PreCon_DatePicker: false,
            Const_Start_Date_NTPPicker: false,
            Const_End_DatePicker: false,
            validation: this.validator.valid()
        }
        this._onDateChange = this._onDateChange.bind(this);
        this._onFocusChange = this._onFocusChange.bind(this);
        this._returnDomainDropdowns = this._returnDomainDropdowns.bind(this);

        
    };
    _onDateChange(date, id) {
        console.log("onDateChange date: ", date._d, "  date._d.valueOf(): ", date._d.valueOf(), " id: ", id);
        var _date = date._d.valueOf();
        let stateCopy ={...this.props.selectedFeature};
        stateCopy[id] = _date;
        this.props.selectFeature(stateCopy);
        // this.setState({
        //     [id]: _date,
        // });
        this._activateSaveButton();
        // if (this.props.saveButton && this.state.validation) {
        //     console.log("setSaveButton")
        //     this.props.setSaveButton()
        // }
    }
    _onFocusChange(e, id='') {
        console.log("date picker focus change: ", e, " id: ", id);
        console.log("before this.state: ", this.state);
        this.setState({
            [id]: e.focused,
        });
        console.log("after this.state: ", this.state);
    }

    _handleCheckboxEvent(val) {
        console.log("_handleCheckboxEvent val is: ",val, "\ttarget: ", val.target);
        console.log("_handleCheckboxEvent val.target.id is: ",val.target.id, "\tval.target.value: ", val.target.value);
        let stateCopy ={...this.props.selectedFeature};
        console.log("old: ", stateCopy[val.target.id] ,"  new ",val.target.id, " is: ", (stateCopy[val.target.id] > 0) ? 0 : 1);
        stateCopy[val.target.id] = (stateCopy[val.target.id] > 0) ? '0' : '1';
        this.props.selectFeature(stateCopy);
        let validation = this.validator.validate(stateCopy);
        console.log("validation: ", validation, "\n\tthis.state.validation: ", this.state.validation);
        this.setState({
            validation: validation
            }, () => { this._activateSaveButton(); }
        );
        
        return val.target.value;
      }

    _handleChangeEvent(val, target) {
        if( val.target ){
            console.log("val.target: ", val.target);
            let stateCopy ={...this.props.selectedFeature};
            stateCopy[val.target.id] = (val.target.value === '' || val.target.value.length === 0) ? null : val.target.value;
            this.props.selectFeature(stateCopy);
            let validation = this.validator.validate(stateCopy);
            console.log("validation: ", validation, "\n\tthis.state.validation: ", this.state.validation);
            this.setState({
                validation: validation
                }, () => { this._activateSaveButton(); }
            );
            return val;
        }
        console.log("val.target: ", val.target);
        let stateCopy ={...this.props.selectedFeature};
        stateCopy[target] = (val === '' || val === 0) ? null : val;
        this.props.selectFeature(stateCopy);
        let validation = this.validator.validate(stateCopy);
        console.log("validation: ", validation, "\n\tthis.state.validation: ", this.state.validation);
        this.setState({
            validation: validation
            }, () => { this._activateSaveButton(); }
        );
        //console.log( "this.state.validation: ", this.state.validation);
        
        return val;
      }

    _activateSaveButton = (event) => {
        //&& this.state.validation.isValid
        if (this.props.saveButton ) {
            console.log("setSaveButton: ", this.props.saveButton, " \t event: ", event, "\n\tvalidation: ", this.state.validation);
            this.props.setSaveButton();
            console.log("\t new prop: ", this.props.saveButton)
         } //else {
        //     this.props.setSaveButton("deactivate");
        // }
    }
    
    _returnDomainDropdowns(_field){
        let items = [];
        items.push(<MenuItem key ={0} value={""} >{ ""}</MenuItem>);
        //var domainName = _field + '_Domain';
        const match = this.props.domains.filter((_dom) => {
            //console.log("_man: ", _man);
            return Object.keys(_dom)[0].indexOf( _field) > -1;
        });
        //console.log("domain dropdown, match: ", match ,"\t for field: ",  _field);

        if (!(match === undefined || match === null || match.length <1)) {
            //var codedVals = Object.keys(match)[0];
            var domainObj = match[0]
            //console.log("domain dropdown, \n\t  domainObj: ", domainObj);
            var domainName = Object.keys(domainObj)[0];

            var sortedObjs = _.sortBy( domainObj[domainName], function(codedValObj) {
                var _key = Object.keys(codedValObj)[0];
                return codedValObj[_key]
            } );
            console.log("sortedObjs: ", sortedObjs);
            sortedObjs.forEach(function(_dom){
                var _key = Object.keys(_dom)[0];
                items.push( <MenuItem key ={_dom[_key]} value={_dom[_key]} >{ _dom[_key]}</MenuItem>)
            })
            console.log("items: ", items);

            // console.log("domainName: ", domainName, " \ndomainObj[domainName]: ", domainObj[domainName]);
            // if (!(domainObj === undefined || domainObj === null)) {
            //     Object.keys(domainObj[domainName]).forEach(function (codedValObj) {
            //         var _key = Object.keys(domainObj[domainName][codedValObj])[0];
            //         var _val = domainObj[domainName][codedValObj][_key];
            //         //console.log("codedValObj: ", codedValObj, "  _key: ", _key, "  _val: ", _val);
            //         items.push(<MenuItem key={_key} value={_key} >{_val}</MenuItem>);
            //     })
            // }
            return items;
        }
       
        console.log(" no domain match for: ", _field)
        return items;
    }

    _returnValuesDropdowns(_type){
        let items = [];
        var sortedObjs ;
        items.push(<MenuItem key ={0} value={""} >{ ""}</MenuItem>);
        if (_type.toLowerCase().indexOf('manager') > -1){
            sortedObjs = _.sortBy( this.props.optionsManagers, 'Name' );
            sortedObjs.forEach(function(_man){
                items.push( <MenuItem key ={_man.OBJECTID} value={_man.Name} >{ _man.Name}</MenuItem>)
            });   
        } else if (_type.toLowerCase().indexOf('inspector') > -1){
            sortedObjs = _.sortBy( this.props.optionsInspectors, 'Name' );
            sortedObjs.forEach(function(_insp){
                items.push( <MenuItem key ={_insp.OBJECTID} value={_insp.Name} >{ _insp.Name}</MenuItem>)
            });   
        }
        else if (_type.toLowerCase().indexOf('contact') > -1){
            sortedObjs = _.sortBy( this.props.optionsContacts, 'Name' );
            sortedObjs.forEach(function(_contact){
                items.push( <MenuItem key ={_contact.OBJECTID} value={_contact.Name} >{ _contact.Name}</MenuItem>)
            });   
        }
        else if (_type.toLowerCase().indexOf('contract') > -1){
            sortedObjs = _.sortBy( this.props.contractors, 'Contractor' );
            // this.props.contractors.forEach(function(_man){
            //     items.push( <MenuItem key ={_man.OBJECTID} value={_man.Contractor} >{ _man.Contractor}</MenuItem>)
            // });  
            sortedObjs.forEach(function(_contract){
                items.push( <MenuItem key ={_contract.OBJECTID} value={_contract.Contractor} >{ _contract.Contractor}</MenuItem>)
            });  
        }
        return items;
    }

    _navToRelatedItem(_type, _matchVal) {
        if (_type.toLowerCase().indexOf('contract') < 0 && _matchVal){
            const match = this.props.employees.filter((_emp) => {
                return _emp['Name'] === _matchVal;
            });
            new Promise(() => {
                this.props.setSelected (match[0], 'employees')
            }).then(this.props.setPanel('employees'))

        } else if (_type.toLowerCase().indexOf('contract') > -1 && _matchVal){
            const match = this.props.contractors.filter((_con) => {
                return _con['Contractor'] === _matchVal;
            });
            new Promise(() => {
                this.props.setSelected (match[0], 'contractor')
            }).then(this.props.setPanel('contractors'))

        } 
    }

    _getRelatedAttribute(_type, _getFld, _matchFld, _matchVal) {
        var val;
        var fld =_getFld;
        var _match;
        //OfficeNumber, CellNumber
        //console.log("_getRelatedAttribute, _type: ", _type, "  _getFld: ", _getFld, " _matchFld: ", _matchFld, "  _matchVal: ", _matchVal);
        if (_type.toLowerCase().indexOf('contact') > -1){
            const match = this.props.optionsContacts.filter((_man) => {
                //console.log("_man: ", _man);
                return _man[_matchFld] === _matchVal;
            });
            //console.log("related match: ", match);
            _match = match[0] ? match[0] : {};
            val = _match[fld] ? _match[fld] : ''
        } else if (_type.toLowerCase().indexOf('contract') > -1){
            const match = this.props.contractors.filter((_man) => {
                //console.log("_man: ", _man);
                return _man[_matchFld] === _matchVal;
            });
            //console.log("related match: ", match);
            _match = match[0] ? match[0] : {};
            val = _match[fld] ? _match[fld] : ''
        }
        else if (_type.toLowerCase().indexOf('inspect') > -1){
            const match = this.props.optionsInspectors.filter((_man) => {
                //console.log("_man: ", _man);
                return _man[_matchFld] === _matchVal;
            });
            console.log("related match: ", match);
            _match = match[0] ? match[0] : {};
            val = _match[fld] ? _match[fld] : ''
        }
        return val;  
    }

    _getAttribute(fld) {
        return this.props.selectedFeature[fld] ? this.props.selectedFeature[fld]: ''
    }

    // Dates  var event = new Date(1361923200000); ==> toString() Tue Feb 26 2013 19:00:00 GMT-0500 (Eastern Standard Time)

    render() {
        let validation = this.validator.validate(this.props.selectedFeature);
        console.log("render's validation: ", validation) 
        return (
            <div className="container-fluid" style={{ padding: "0px", backgroundColor: "transparent" }}>
                <Row >
                    <Col lg="12">
                        <FormControlLabel style={{ minWidth: '120px', fontWeight: "bolder", fontSize: "18px", textAlign: "left", color: CalciteTheme.palette.blue }}>
                            Select a Project
                        </FormControlLabel>
                        <SearchComponent type='projects' />
                    </Col>
                </Row>
                <Row className="mt-2">
                    <Col lg="4">
                        <Card bar="darkBlue" style={{ margin: '0px', flex: '1 1 20%', minHeight: '100%' }}>
                            <CardContent>
                                <CardTitle style={{
                                    minWidth: '120px', fontWeight: 'bolder', fontSize: '17px', textAlign: 'left',
                                    color: CalciteTheme.palette.darkBlue
                                }}> Project Info</CardTitle>
                                <Form horizontal style={{ padding: '1px' }} >
                                    <Col >
                                        <StyledFormControl horizontal>
                                            <StyledProjectLabel>Project Name</StyledProjectLabel>
                                            <TextField fullWidth id='Project_Name' type="textarea"
                                                style={{ resize: 'both', maxHeight: '100%', height: '65px' }}
                                                value={!(Object.keys(this.props.selectedFeature).length > 0) ?
                                                    " Search and Select a Project.\n (Use the Map to Create New Projects)" :
                                                    this._getAttribute('Project_Name')}
                                                onChange={this._handleChangeEvent.bind(this)}
                                                disabled={!(Object.keys(this.props.selectedFeature).length > 0)} />
                                        </StyledFormControl>

                                        <StyledFormControl horizontal error={validation.Status.isInvalid}>
                                            <StyledProjectLabel>Status</StyledProjectLabel>
                                            <StyledSelect fullWidth id='Status' selectedValue={this._getAttribute('Status')}
                                                onChange={(e) => this._handleChangeEvent(e, 'Status')}
                                                disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                            /* onChange={this._handleChangeEvent.bind(this)} */ >
                                                {this._returnDomainDropdowns('Status')}
                                            </StyledSelect>
                                        </StyledFormControl>

                                        <StyledFormControl horizontal error={validation.Project_Manager.isInvalid}>
                                            <StyledProjectLabel>Project Manager</StyledProjectLabel>
                                            <StyledSelect className="d-flex align-items-center" fullWidth
                                                id='Project_Manager' selectedValue={this._getAttribute('Project_Manager')}
                                                placeholder={this._getAttribute('Project_Manager') ? this._getAttribute('Project_Manager') : "Select..."}
                                                disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                                onChange={(e) => this._handleChangeEvent(e, 'Project_Manager')}
                                                onDoubleClick={ (e) => {
                                                    this._navToRelatedItem('employee', this._getAttribute('Project_Manager') )
                                                } }
                                            >
                                                {this._returnValuesDropdowns('manager')}
                                            </StyledSelect>
                                        </StyledFormControl>
                                        <StyledFormControl horizontal error={validation.Project_Type.isInvalid}>
                                            <StyledProjectLabel>Project Type</StyledProjectLabel>
                                            <StyledSelect className="d-flex align-items-center" fullWidth
                                                id='Project_Type' selectedValue={this._getAttribute('Project_Type')}
                                                disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                                onChange={(e) => this._handleChangeEvent(e, 'Project_Type')}
                                            >
                                                {this._returnDomainDropdowns('Project_Type')}
                                            </StyledSelect>
                                        </StyledFormControl>
                                        <StyledFormControl horizontal>
                                            <StyledProjectLabel>Project Originator</StyledProjectLabel>
                                            <StyledSelect className="d-flex align-items-center" fullWidth
                                                id='Project_Originator' selectedValue={this._getAttribute('Project_Originator')}
                                                disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                                onChange={(e) => this._handleChangeEvent(e, 'Project_Originator')}
                                            >
                                                {this._returnDomainDropdowns('Project_Originator')}
                                            </StyledSelect>
                                        </StyledFormControl>
                                        <StyledFormControl horizontal>
                                            <StyledProjectLabel>Project Location</StyledProjectLabel>
                                            <TextField className="d-flex align-items-center" fullWidth
                                                id='Project_Location' 
                                                value={!(Object.keys(this.props.selectedFeature).length > 0) ? " " : this._getAttribute('Project_Location')}
                                                disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                                onChange={(e) => this._handleChangeEvent(e, 'Project_Location')} 
                                            />
                                        </StyledFormControl>
                                        <StyledFormControl horizontal>
                                            <StyledProjectLabel>WRE Project #</StyledProjectLabel>
                                            <TextField className="d-flex align-items-center" fullWidth
                                                id='WRE_ProjectNo' 
                                                value={!(Object.keys(this.props.selectedFeature).length > 0) ? " " : this._getAttribute('WRE_ProjectNo')}
                                                disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                                onChange={(e) => this._handleChangeEvent(e, 'WRE_ProjectNo')} 
                                            />
                                        </StyledFormControl>
                                        <StyledFormControl horizontal>
                                            <StyledProjectLabel>Contact</StyledProjectLabel>
                                            <StyledSelect fullWidth className="d-flex align-items-center"
                                                id='Contact' selectedValue={this._getAttribute('Contact')}
                                                placeholder={this._getAttribute('Contact') ? this._getAttribute('Contact') : "Select..."}
                                                disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                                onChange={(e) => this._handleChangeEvent(e, 'Contact')}
                                                onDoubleClick={ (e) => {
                                                    console.log("double click event: ", e)
                                                    this._navToRelatedItem('employee', this._getAttribute('Contact') )
                                                } }
                                            >
                                                {this._returnValuesDropdowns('contact')}
                                            </StyledSelect>
                                        </StyledFormControl>
                                        <StyledFormControl horizontal /* error={validation.Contact_Phone.isInvalid} */  >
                                            <StyledProjectLabel >Contact Phone #</StyledProjectLabel>
                                            <TextField fullWidth id='ContactPhone' type="text"
                                                value={this._getRelatedAttribute('contact', 'CellNumber', 'Name', this._getAttribute('Contact')) ?
                                                    this._getRelatedAttribute('contact', 'CellNumber', 'Name', this._getAttribute('Contact')) :
                                                    this._getRelatedAttribute('contact', 'OfficeNumber', 'Name', this._getAttribute('Contact'))
                                                }
                                                onChange={this._handleChangeEvent.bind(this)}
                                                disabled={true} 
                                                onDoubleClick={ (e) => {
                                                    this._navToRelatedItem('employee', this._getAttribute('Contact') )
                                                } }
                                            />
                                            {/* {validation.Contact_Phone.isInvalid ? <FormHelperText className="d-flex align-items-center"> {validation.Contact_Phone.message}</FormHelperText> : null} */}
                                        </StyledFormControl>

                                        <StyledFormControl horizontal>
                                            <StyledProjectLabel>Project Notes</StyledProjectLabel>
                                            <TextField fullWidth id='Notes' type="textarea"
                                                style={{ resize: 'both', maxHeight: '100%', height: '95px' }}
                                                value={ this._getAttribute('Notes')}
                                                onChange={this._handleChangeEvent.bind(this)}
                                                disabled={!(Object.keys(this.props.selectedFeature).length > 0)} 
                                            />
                                        </StyledFormControl>
                                    </Col>
                                </Form>
                            </CardContent>
                        </Card>
                    </Col>
                    <Col lg="8">
                        <Row>
                        <Col lg="6" >
                            <Card bar="lightOrange" style={{ margin: '0px', flex: '1 1 20%', minHeight: '100%', paddingLeft: 0 }}>
                                <CardContent>
                                    <CardTitle style={{
                                        minWidth: '120px', fontWeight: 'bolder', fontSize: '17px', textAlign: 'left',
                                        color: CalciteTheme.palette.lightOrange
                                    }}> Construction</CardTitle>
                                    <Form horizontal style={{ padding: '1px' }} >
                                            <Col >
                                                <StyledFormControl horizontal>
                                                    <StyledProjectLabel>Contractor</StyledProjectLabel>
                                                    <StyledSelect fullWidth className="d-flex align-items-center"
                                                        id='Contractor' selectedValue={this._getAttribute('Contractor')}
                                                        placeholder={this._getAttribute('Contractor') ? this._getAttribute('Contractor') : "Select..."}
                                                        disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                                        onChange={(e) => this._handleChangeEvent(e, 'Contractor')}
                                                        onDoubleClick={ (e) => {
                                                            console.log('double click event: ', e)
                                                            this._navToRelatedItem('contractor', this._getAttribute('Contractor') )
                                                        } } 
                                                    >
                                                        {this._returnValuesDropdowns('Contractor')}
                                                    </StyledSelect>
                                                </StyledFormControl>
                                                <StyledFormControl horizontal /* error={validation.Contact_Phone.isInvalid} */  >
                                                    <StyledProjectLabel >Contractor Phone #</StyledProjectLabel>
                                                    <TextField fullWidth id='ContractorPhone' type="text"
                                                        value={this._getRelatedAttribute('Contractor', 'Contact_Number', 'Contractor', this._getAttribute('Contractor')) ? 
                                                            this._getRelatedAttribute('Contractor', 'Contact_Number', 'Contractor', this._getAttribute('Contractor')) :
                                                            this._getRelatedAttribute('Contractor', 'Contact_Cell', 'Contractor', this._getAttribute('Contractor'))
                                                        }
                                                        onChange={this._handleChangeEvent.bind(this)}
                                                        onDoubleClick={ (e) => {
                                                            this._navToRelatedItem('contractor', this._getAttribute('Contractor') )
                                                        } } 
                                                        disabled={true} 
                                                    />
                                                </StyledFormControl>
                                                <StyledFormControl horizontal>
                                                    <StyledProjectLabel>Contractor On Site</StyledProjectLabel>
                                                    <StyledSelect fullWidth className="d-flex align-items-center"
                                                        id='Company_On_Site' selectedValue={this._getAttribute('Company_On_Site')}
                                                        placeholder={this._getAttribute('Company_On_Site') ? this._getAttribute('Company_On_Site') : "Select..."}
                                                        disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                                        onChange={(e) => this._handleChangeEvent(e, 'Company_On_Site')}
                                                        onDoubleClick={ (e) => {
                                                            this._navToRelatedItem('contractor', this._getAttribute('Company_On_Site') )
                                                        } } 
                                                    >
                                                        {this._returnValuesDropdowns('Contractor')}
                                                    </StyledSelect>
                                                </StyledFormControl>
                                                <StyledFormControl horizontal>
                                                    <StyledProjectLabel>Inspector</StyledProjectLabel>
                                                    <StyledSelect fullWidth className="d-flex align-items-center"
                                                        id='Inspector' selectedValue={this._getAttribute('Inspector')}
                                                        placeholder={this._getAttribute('Inspector') ? this._getAttribute('Inspector') : "Select..."}
                                                        disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                                        onChange={(e) => this._handleChangeEvent(e, 'Inspector')}
                                                        onDoubleClick={ (e) => {
                                                            this._navToRelatedItem('employee', this._getAttribute('Inspector') )
                                                        } } 
                                                    >
                                                        {this._returnValuesDropdowns('Inspector')}
                                                    </StyledSelect>
                                                </StyledFormControl>
                                                <StyledFormControl horizontal /* error={validation.Contact_Phone.isInvalid} */  >
                                                    <StyledProjectLabel >Inspector Phone #</StyledProjectLabel>
                                                    <TextField fullWidth id='InspectorPhone' type="text"
                                                        value={this._getRelatedAttribute('Inspector', 'CellNumber', 'Name', this._getAttribute('Inspector'))?
                                                            this._getRelatedAttribute('Inspector', 'CellNumber', 'Name', this._getAttribute('Inspector')) :
                                                            this._getRelatedAttribute('Inspector', 'OfficeNumber', 'Name', this._getAttribute('Inspector'))
                                                        }
                                                        onChange={this._handleChangeEvent.bind(this)}
                                                        onDoubleClick={ (e) => {
                                                            this._navToRelatedItem('employee', this._getAttribute('Inspector') )
                                                        } }
                                                        disabled={true} 
                                                    />
                                                </StyledFormControl>
                                                <CardTitle style={{
                                                    minWidth: '120px', fontWeight: 'bolder', fontSize: '17px', textAlign: 'left', marginTop: '15px',
                                                    color: CalciteTheme.palette.lightOrange
                                                }}> Schedule</CardTitle>
                                            </Col>
                                    <Row >
                                        <Col >
                                            <StyledFormControl horizontal className='d-flex align-items-center'>
                                                <StyledProjectLabel>Let Dates</StyledProjectLabel>
                                                <StyledDatePicker
                                                    disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                                    id="Let_DatePicker"
                                                    yearSelectDates={{ startYear: new moment().subtract('year', 10).year(), endYear: new moment().add('year', 10).year() }}
                                                    date={this._getAttribute('Let_Date') ? new moment(new Date(this._getAttribute('Let_Date'))) : undefined}
                                                    onDateChange={(e) => this._onDateChange(e, "Let_Date")}
                                                    focused={this.state.Let_DatePicker}
                                                    onFocusChange={(e) => this._onFocusChange(e, 'Let_DatePicker')}
                                                    numberOfMonths={1}
                                                    isOutsideRange={() => { }}
                                                    monthYearSelectionMode="MONTH_YEAR"
                                                />
                                            </StyledFormControl>
                                        </Col>
                                        <Col >
                                            <StyledFormControl horizontal className='d-flex align-items-center'>
                                                <StyledProjectLabel>Pre Bid Date</StyledProjectLabel>
                                                <StyledDatePicker
                                                    disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                                    id="PreBid_DatePicker"
                                                    yearSelectDates={{ startYear: new moment().subtract('year', 10).year(), endYear: new moment().add('year', 10).year() }}
                                                    date={this._getAttribute('PreBid_Date') ? new moment(new Date(this._getAttribute('PreBid_Date'))) : undefined}
                                                    onDateChange={(e) => this._onDateChange(e, "PreBid_Date")}
                                                    focused={this.state.PreBid_DatePicker}
                                                    onFocusChange={(e) => this._onFocusChange(e, 'PreBid_DatePicker')}
                                                    numberOfMonths={1}
                                                    isOutsideRange={() => { }}
                                                    monthYearSelectionMode="MONTH_YEAR"
                                                />
                                            </StyledFormControl>
                                        </Col>
                                    </Row>
                                    <Row >
                                        <Col>
                                            <StyledFormControl horizontal>
                                                <StyledProjectLabel>Bid Opening Date</StyledProjectLabel>
                                                <StyledDatePicker
                                                    disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                                    id="BidOpening_DatePicker"
                                                    yearSelectDates={{ startYear: new moment().subtract('year', 10).year(), endYear: new moment().add('year', 10).year() }}
                                                    date={this._getAttribute('BidOpening_Date') ? new moment(new Date(this._getAttribute('BidOpening_Date'))) : undefined}
                                                    onDateChange={(e) => this._onDateChange(e, "BidOpening_Date")}
                                                    focused={this.state.BidOpening_DatePicker}
                                                    onFocusChange={(e) => this._onFocusChange(e, 'BidOpening_DatePicker')}
                                                    numberOfMonths={1}
                                                    isOutsideRange={() => { }}
                                                    monthYearSelectionMode="MONTH_YEAR"
                                                />
                                            </StyledFormControl>
                                        </Col>
                                        <Col>
                                            <StyledFormControl horizontal>
                                                <StyledProjectLabel>Pre Con Date</StyledProjectLabel>
                                                <StyledDatePicker
                                                    disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                                    id="PreCon_DatePicker"
                                                    yearSelectDates={{ startYear: new moment().subtract('year', 10).year(), endYear: new moment().add('year', 10).year() }}
                                                    date={this._getAttribute('PreCon_Date') ? new moment(new Date(this._getAttribute('PreCon_Date'))) : undefined}
                                                    onDateChange={(e) => this._onDateChange(e, "PreCon_Date")}
                                                    focused={this.state.PreCon_DatePicker}
                                                    onFocusChange={(e) => this._onFocusChange(e, 'PreCon_DatePicker')}
                                                    numberOfMonths={1}
                                                    isOutsideRange={() => { }}
                                                    monthYearSelectionMode="MONTH_YEAR"
                                                />
                                            </StyledFormControl>
                                        </Col>
                                    </Row>
                                    <Row >
                                        <Col>
                                            <StyledFormControl horizontal>
                                                <StyledProjectLabel>Constr. NTP</StyledProjectLabel>
                                                <StyledDatePicker
                                                    disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                                    id="Const_Start_Date_NTPPicker"
                                                    yearSelectDates={{ startYear: new moment().subtract('year', 10).year(), endYear: new moment().add('year', 10).year() }}
                                                    date={this._getAttribute('Const_Start_Date_NTP') ? new moment(new Date(this._getAttribute('Const_Start_Date_NTP'))) : undefined}
                                                    onDateChange={(e) => this._onDateChange(e, "Const_Start_Date_NTP")}
                                                    focused={this.state.Const_Start_Date_NTPPicker}
                                                    onFocusChange={(e) => this._onFocusChange(e, 'Const_Start_Date_NTPPicker')}
                                                    numberOfMonths={1}
                                                    isOutsideRange={() => { }}
                                                    monthYearSelectionMode="MONTH_YEAR"
                                                />
                                            </StyledFormControl>
                                        </Col>
                                        <Col>
                                            <StyledFormControl horizontal>
                                                <StyledProjectLabel>Constr. End Date</StyledProjectLabel>
                                                <StyledDatePicker
                                                    disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                                    id="Const_End_DatePicker"
                                                    yearSelectDates={{ startYear: new moment().subtract('year', 10).year(), endYear: new moment().add('year', 10).year() }}
                                                    date={this._getAttribute('Const_End_Date') ? new moment(new Date(this._getAttribute('Const_End_Date'))) : undefined}
                                                    onDateChange={(e) => this._onDateChange(e, "Const_End_Date")}
                                                    focused={this.state.Const_End_DatePicker}
                                                    onFocusChange={(e) => this._onFocusChange(e, 'Const_End_DatePicker')}
                                                    numberOfMonths={1}
                                                    isOutsideRange={() => { }}
                                                    monthYearSelectionMode="MONTH_YEAR"
                                                />
                                            </StyledFormControl>
                                        </Col>
                                    </Row>
                                            <StyledFormControl >
                                                <StyledProjectLabel >Constr. Duration</StyledProjectLabel>
                                                <TextField fullWidth id='ConsDuration' type="text"
                                                    value={(this._getAttribute('Const_End_Date') && this._getAttribute('Const_Start_Date_NTP')) ?
                                                        moment.utc(new moment(new Date(this._getAttribute('Const_End_Date'))).diff(new moment(new Date(this._getAttribute('Const_Start_Date_NTP'))))).format("DD") 
                                                        : ""
                                                    }
                                                    onChange={this._handleChangeEvent.bind(this)}
                                                    disabled={true} 
                                                />
                                            </StyledFormControl>
                                    </Form>
                                </CardContent>
                            </Card>
                        </Col>
                        <Col lg="6">
                            <Card bar="lightOrange" style={{ margin: '0px', flex: '1 1 20%' }}>
                                <CardContent>
                                    <CardTitle style={{
                                        minWidth: '120px', fontWeight: 'bolder', fontSize: '17px', textAlign: 'left',
                                        color: CalciteTheme.palette.lightOrange
                                    }}> Utilities Involved</CardTitle>
                                    <Form vertical style={{ flex: 1, backgroundColor: CalciteTheme.palette.white }}>
                                        <Row style={{ flex: 1 }} className="align-items-center m-0 p-0">
                                            <Col sm="6" className="d-flex justify-content-center m-0 p-0">
                                                <Checkbox id='WaterWork' labelStyle={{ fontWeight: 'bold', fontSize: '16px' }}
                                                    value={this._getAttribute('WaterWork').toString()}
                                                    checked={(this._getAttribute('WaterWork') === '1') ? true : false}
                                                    onChange={this._handleCheckboxEvent.bind(this)}
                                                    fullWidth
                                                    disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                                > Water Work
                                            </Checkbox>
                                            </Col>
                                            <Col sm="6" className="d-flex justify-content-center">
                                                <Checkbox id='SewerWork' labelStyle={{ fontWeight: 'bold' }}
                                                    value={this._getAttribute('SewerWork').toString()}
                                                    checked={(this._getAttribute('SewerWork') === '1') ? true : false}
                                                    onChange={this._handleCheckboxEvent.bind(this)}
                                                    fullWidth
                                                    disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                                > Sewer Work
                                            </Checkbox>
                                            </Col>
                                        </Row>
                                        <Row style={{ flex: 1 }} className="align-items-center m-0 p-0">
                                            <Col sm="4" className="d-flex justify-content-center m-0 p-0">
                                                <Checkbox id='StormWork' labelStyle={{ fontWeight: 'bold' }}
                                                    value={this._getAttribute('StormWork').toString()}
                                                    checked={(this._getAttribute('StormWork') === '1') ? true : false}
                                                    onChange={this._handleCheckboxEvent.bind(this)}
                                                    disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                                    fullWidth
                                                > Storm Work
                                            </Checkbox>
                                            </Col>
                                            <Col sm="4" className="d-flex justify-content-center m-0 p-0">
                                                <Checkbox id='RoadWork' labelStyle={{ fontWeight: 'bold' }}
                                                    value={this._getAttribute('RoadWork').toString()}
                                                    checked={(this._getAttribute('RoadWork') === '1') ? true : false}
                                                    onChange={this._handleCheckboxEvent.bind(this)}
                                                    disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                                    fullWidth
                                                > Road Work
                                            </Checkbox>
                                            </Col>
                                            <Col sm="4" className="d-flex justify-content-center m-0 p-0">
                                                <Checkbox id='GasWork' labelStyle={{ fontWeight: 'bold' }}
                                                    value={this._getAttribute('GasWork').toString()}
                                                    checked={(this._getAttribute('GasWork') === '1') ? true : false}
                                                    onChange={this._handleCheckboxEvent.bind(this)}
                                                    disabled={!(Object.keys(this.props.selectedFeature).length > 0)}
                                                    fullWidth
                                                > Gas Work
                                            </Checkbox>
                                            </Col>
                                        </Row>
                                            <CardTitle style={{
                                                minWidth: '120px', fontWeight: 'bolder', fontSize: '17px', textAlign: 'left', marginTop: '15px',
                                                color: CalciteTheme.palette.lightOrange
                                                }}
                                            > Construction Notes
                                            </CardTitle>
                                            <TextField fullWidth id='Construction_Notes' type="textarea"
                                                style={{ resize: 'both', maxHeight: '100%', height: '85px' }}
                                                value={ this._getAttribute('Construction_Notes')}
                                                onChange={this._handleChangeEvent.bind(this)}
                                                disabled={!(Object.keys(this.props.selectedFeature).length > 0)} 
                                            />
                                    </Form>
                                </CardContent>
                            </Card>
                        </Col>
                        </Row>
                    </Col>
                </Row>

            </div>
        )
    }
}
ProjectDetails.contextType = ThemeContext;

  // selector functions to reshape the state
const mapStateToProps = state => ({
    selectedFeature: state.map.selectedFeature,
    projects: parseProjectData(state),
    domains: parseDomainValues(state),
    optionsManagers: parseEmployeesData(state, 'managers'),//state.map.managers,
    optionsContacts: parseEmployeesData(state, 'contacts'),
    optionsInspectors: parseEmployeesData(state, 'inspectors'),
    employees: parseEmployeesData(state, 'all'),
    contractors: parseContractorData(state),
    saveButton: state.attributes.saveButton
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        ...attributeActions, ...mapActions
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps, null, { context: StoreContext })(ProjectDetails);