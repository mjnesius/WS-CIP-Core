import React from "react";
import Checkbox from 'calcite-react/Checkbox';

//redux
import { bindActionCreators } from 'redux';
import { actions as attributeActions } from '../redux/reducers/attributes';
import { actions as mapActions } from '../redux/reducers/map';
import{StoreContext} from "./StoreContext";
import { connect } from 'react-redux';
//getColumnsFromFields,
import { parseEmployeesData, parseDomainValues} from '../redux/selectors';

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

//components
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
import SearchComponent from './SearchComponent';

import styled from 'styled-components';
const Container = styled.div`
   max-width: 100%;
   height: 100%;
   overflow: scroll;
   display: flex;
   flex-direction: column;
`;
const makeDefaultState = (selected) => ({
  selectedEmployee: selected,
  filtered: []
});

class EmployeeAttributes extends React.Component {
  constructor(props) {
    super(props);
    this.state =  makeDefaultState(this.props.selectedContractor);
 
    this.renderCell = this.renderCell.bind(this);
  }

  _handleSelectionEvent(val) {
    console.log(val);
    this.props.setSelected(val, 'employee')
  }
  _handleChangeEvent(val) {
    console.log("_handleChangeEvent val is: ", val.target);
    let stateCopy = { ...this.props.selectedEmployee };
    stateCopy[val.target.id] = val.target.value;
    // val['Contractor']
    // this.setState({          
    //     ..,
    //     contractor: this.props.selectedContractor['Contractor'] ? this.props.selectedContractor['Contractor'] : ""
    // });
    this.props.setSelected(stateCopy, 'employee');
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
    return this.props.selectedEmployee[fld] ? this.props.selectedEmployee[fld] : ''
  }
  _handleCheckboxEvent(val) {
    console.log("_handleCheckboxEvent val is: ", val, "\ttarget: ", val.target);
    console.log("_handleCheckboxEvent val.target.id is: ", val.target.id, "\tval.target.value: ", val.target.value);
    let stateCopy = { ...this.props.selectedEmployee };
    console.log("old: ", stateCopy[val.target.id], "  new ", val.target.id, " is: ", (stateCopy[val.target.id] > 0) ? 0 : 1);
    stateCopy[val.target.id] = (stateCopy[val.target.id] > 0) ? '0' : '1';

    this.props.setSelected(stateCopy, 'employee')
    this.setState({
      filtered: []
    });
    this.props.selectFeature(stateCopy);
    this._activateSaveButton();
    // let validation = this.validator.validate(stateCopy);
    // console.log("validation: ", validation, "\n\tthis.state.validation: ", this.state.validation);
    // this.setState({
    //   validation: validation
    // }, () => { this._activateSaveButton(); }
    // );

    return val.target.value;
  }

  renderCell(cellInfo) {
    
    if (cellInfo.column.id.indexOf("IsWS") > -1){
      //console.log("cellInfo: ", cellInfo);
      //console.log("cellInfo.column.value: ", cellInfo.value);
      //console.log("cellInfo.value === '1' ||  cellInfo.value === 1 || cellInfo.value === true: ", (cellInfo.value === "1" ||  cellInfo.value === 1 || cellInfo.value === true) ? true: false);
        
      return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center !important', verticalAlign: 'middle'}}>
          <Checkbox style={{cursor: 'default'}}
          disabled
          input="disabled {}"
          id={cellInfo.column.id} 
          //value={cellInfo.value}
          checked={(cellInfo.value === "1" ||  cellInfo.value === 1 || cellInfo.value === true) ? true: false}
        />
        </div>
          
       
      );
    }
    return (
      <div>
        {cellInfo.value}
      </div>
    );
  }

  render() {
    //const { data } = this.state;
    var skipFields = [ "OBJECTID", "LastName", "FirstName", "MidName"];
    const filterCol = this.props.fields.filter (col => {
        return skipFields.indexOf(col.name) === -1;
      
    })
    const columns = filterCol.reverse().map((fld) => {
      //console.log(fld.name);
      var _filter =  fld.name.toUpperCase().indexOf("COST") > -1 ? false : true;
      return {Header: fld.alias, Cell: this.renderCell, id: fld.name, accessor: fld.name, resizable: true, sortable: true,
        filterable: _filter,
        minWidth: '100%', style: {width: '100%'},
        headerStyle: {fontWeight: 500, width: '180px'}
      }
    })
    console.log("this.props.employees: ", this.props.employees);
    return (
      <Container/*  className="container-fluid, overflow-y overflow-x" */ style={{padding: "15px", backgroundColor: "transparent"}}>
        <Row >
          <Col lg="12">
            <FormControlLabel style={{ minWidth: '120px' }}>Select an Employee</FormControlLabel>
            <SearchComponent type='employees' />
          </Col>
        </Row>
        <Row className=" mt-2">
          <Form horizontal style={{ flex: '1 1 100%' }}>
            <Row style={{ flex: '1 1 100%' }}>
              <Col sm="8">
                <Panel style={{ flex: '1 1 100%', color: CalciteTheme.palette.darkBlue }}>
                  <PanelTitle style={{ textAlign: 'left' }}>Employee Info.</PanelTitle>
                  <PanelText className="mx-2">
                    <Row >
                      <Col sm="4" className="d-flex align-items-left" >
                        <FormControl fullWidth>
                          <FormControlLabel style={{ minWidth: '160px', textAlign: 'left', paddingLeft: '5' }}>Name</FormControlLabel>
                          <TextField id="Name" value={this._getAttribute('Name')}
                            onChange={this._handleChangeEvent.bind(this)} fullWidth type="textarea"
                            style={{ resize: 'both', maxHeight: '100%', height: '36px' }}
                          >
                          </TextField>
                        </FormControl>
                        <FormControl >
                          <FormControlLabel style={{ minWidth: '160px', textAlign: 'left', paddingLeft: '5' }}>Employee ID</FormControlLabel>
                          <TextField id="Employee_ID" value={this._getAttribute('Employee_ID')}
                            onChange={this._handleChangeEvent.bind(this)} fullWidth>
                          </TextField>
                        </FormControl>
                      </Col>
                      <Col sm="8" className="d-flex align-items-left">
                        <FormControl >
                          <FormControlLabel style={{ width: '120px', textAlign: 'left', paddingLeft: '3' }} >Office Number</FormControlLabel>
                          <TextField id="OfficeNumber" value={this._getAttribute('OfficeNumber')}
                            onChange={this._handleChangeEvent.bind(this)} fullWidth>
                          </TextField>
                        </FormControl>
                        <FormControl >
                          <FormControlLabel style={{ width: '160px', textAlign: 'left', paddingLeft: '3' }}>Cell Number</FormControlLabel>
                          <TextField id="CellNumber" value={this._getAttribute('CellNumber')}
                            onChange={this._handleChangeEvent.bind(this)} fullWidth>
                          </TextField>
                        </FormControl>
                        <FormControl >
                          <FormControlLabel style={{ width: '80px', textAlign: 'left', paddingLeft: '1' }}>Email</FormControlLabel>
                          <TextField id="Email" value={this._getAttribute('Email')}
                            onChange={this._handleChangeEvent.bind(this)} fullWidth>
                          </TextField>
                        </FormControl>
                      </Col>
                    </Row>
                  </PanelText>
                </Panel>
              </Col>
              <Col>
                <Panel style={{ flex: '1 1 100%', color: CalciteTheme.palette.darkBlue }}>
                  <PanelTitle style={{ textAlign: 'left' }}>Employee Duties</PanelTitle>
                  <PanelText className="mx-2">
                    <Row >
                      <Checkbox id='IsWSProjMgr'
                        labelStyle={{ fontWeight: 'bold', fontSize: '16px' }}
                        value={this._getAttribute('IsWSProjMgr').toString()}
                        checked={(this._getAttribute('IsWSProjMgr') === '1') ? true : false}
                        onChange={this._handleCheckboxEvent.bind(this)}
                        fullWidth
                        disabled={!(Object.keys(this.props.selectedEmployee).length > 0)}
                      > WS Project Manager
                      </Checkbox>
                      <Checkbox id='IsWSPMInspector'
                        labelStyle={{ fontWeight: 'bold', fontSize: '16px' }}
                        value={this._getAttribute('IsWSPMInspector').toString()}
                        checked={(this._getAttribute('IsWSPMInspector') === '1') ? true : false}
                        onChange={this._handleCheckboxEvent.bind(this)}
                        fullWidth
                        disabled={!(Object.keys(this.props.selectedEmployee).length > 0)}
                      > WS Inspector
                      </Checkbox>
                      <Checkbox id='IsWSPMContact'
                        labelStyle={{ fontWeight: 'bold', fontSize: '16px' }}
                        value={this._getAttribute('IsWSPMContact').toString()}
                        checked={(this._getAttribute('IsWSPMContact') === '1') ? true : false}
                        onChange={this._handleCheckboxEvent.bind(this)}
                        fullWidth
                        disabled={!(Object.keys(this.props.selectedEmployee).length > 0)}
                      > WS Project Contact
                      </Checkbox>
                    </Row>
                  </PanelText>
                </Panel>
              </Col>
            </Row>
          </Form>
        </Row>
        <Row style={{ flex: '1 1 100%' }}>
          <ReactTable defaultPageSize={this.props.employees.length} 
            className="-striped -highlight" 
            columns={columns} data={this.props.employees}
            defaultFilterMethod={(filter, row) => {
              const id = filter.pivotId || filter.id
              return row[id] !== undefined ? String(row[id]).toUpperCase().indexOf(String(filter.value).toUpperCase()) > -1 : true
            }}
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
                  //this.props.selectFeature(rowInfo.original);
                  this._handleSelectionEvent(rowInfo.original);
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

    );
  }
}

// selector functions to reshape the state
//getColumnsFromFields(state, "employees")
const mapStateToProps = state => ({
    fields: state.map.employees['fields'],
    selectedEmployee: state.attributes.selectedEmployee,
    employees: parseEmployeesData(state),
    isVisible: state.map.attributesComponent,
    domains: parseDomainValues(state),
    saveButton: state.attributes.saveButton
  });
    
    const mapDispatchToProps = dispatch => {
      return bindActionCreators({
        ...attributeActions, ...mapActions
      }, dispatch);
    } 
  
  export default connect(mapStateToProps, mapDispatchToProps, null, {context:StoreContext}) (EmployeeAttributes);
