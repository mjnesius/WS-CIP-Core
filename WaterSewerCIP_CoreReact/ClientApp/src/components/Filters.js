import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
//import Container from 'react-bootstrap/Container';
//import { Container, Row, Col} from 'react-bootstrap';
//import { actions } from '../redux/reducers/map';
// import Dropdown from 'react-bootstrap/Dropdown'
// import ButtonGroup from 'react-bootstrap/ButtonGroup'

//import Map from '../components/esri/map/Map';
// Redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as mapActions } from '../redux/reducers/map';
import { actions as filterActions } from '../redux/reducers/filters';
//import Select, { components } from 'react-select'
import{StoreContext} from "./StoreContext";
//import { ReactReduxContext } from 'react-redux'
// Styled Components
import Button from 'calcite-react/Button';
import styled from 'styled-components';
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;


class FilterComponent extends Component {
  constructor(props) {
    super(props);
    this._onSelect = this._onSelect.bind(this);
    this._clearFilter = this._clearFilter.bind(this)
  }
  _clearFilter(){
    this.props.setStatus("%");
    this.props.setManager("%");
    this.props.setYear("%");
    this.props.setDefExp();
    this.props.setFilterButton();
  }
  _onSelect(option) {
    
    if(option){
      console.log('You selected', option.target.value, " \t", option.target);
      if (option.target.id.indexOf("status") > -1 ){
        this.props.setStatus(option.target.value.split('_')[0] );
        this.props.setDefExp();
      }
      else if (option.target.id.indexOf("manag") > -1 ) {

        this.props.setManager(option.target.value.split('_')[0] );
        this.props.setDefExp();
      } else{
        this.props.setYear(option.target.value.split('_')[0] );
        this.props.setDefExp();
      }

      if(this.props.filterButton){
        this.props.setFilterButton();
      }
    }
  } 
  // shouldComponentUpdate(){
  //   //console.log("filter component did update")
  //   if (typeof this.props.statuses !== 'undefined'){
  //     //console.log("false should update")
  //     return false
  //   }
      
  //   else {
  //     //console.log("true should update"); 
  //     return true
  //   } 
  // }
  render() {
    if (typeof this.props.optionsStatus !== 'undefined') {
      //console.log("filter component with drop downs")
      return (
        <Container>
          <Row lg="auto" >
            <Col >
              <Form inline>
                <Form.Control as="select" onChange={this._onSelect}
                  id="status"
                  value={(this.props.selectedStatus === "%") ? "%_Statuses": this.props.selectedStatus }>
                  {/* <option key={"All Statuses"} value={"%_Statuses"}>All Statuses</option>
                  {this.props.optionsStatus.map((e, key) => {
                    return <option key={key} value={e}>{e}</option>;
                  })} */}
                  {this.props.optionsStatus.map((e, key) => {
                    if (e.indexOf("All Statuses") > -1){
                      return <option key="All Statuses" value="%_Statuses">All Statuses</option>;
                    } else{
                      return <option key={key} value={e}>{e}</option>;
                    }
                  })}
                </Form.Control>
                <Form.Control as="select" onChange={this._onSelect}
                  id="year"
                  value={(this.props.selectedYear.indexOf("%") > -1) ? "%_Years" : this.props.selectedYear }>
                  {this.props.optionsYears.map((e, key) => {
                    if (String(e).indexOf("All Years") > -1) {
                      return <option key="All Years" value="%_Years">All Years</option>;
                    } else {
                      return <option key={key} value={String(e)}>{e}</option>;
                    }
                  })}
                </Form.Control>
                <Form.Control as="select" onChange={this._onSelect} 
                  id="manager"
                  value={!(this.props.selectedManager === "%") ? this.props.selectedManager : "%_Managers"}>
                  {/* <option key={"All Managers"} value={"%_Managers"}>All Mangers</option> */}
                  {this.props.optionsManagers.map((e, key) => {
                    if (e.indexOf("All Managers") > -1){
                      return <option key="All Managers" value="%_Managers">All Managers</option>;
                    } else{
                      return <option key={key} value={e}>{e}</option>;
                    }
                  })}
                </Form.Control>
                <Button disabled={this.props.filterButton} small className="m-1 ml-3 p-1 px-2" onClick={this._clearFilter}>Clear Filter</Button>
              </Form>
            </Col>
          </Row>
        </Container>
        
      );
    }
  }
}

const mapStateToProps = state => ({
  
  optionsYears:state.map.years,
  optionsStatus: state.map.statuses,
  optionsManagers: state.map.managers,
  selectedYear: state.filter.selectedYear,
  selectedStatus: state.filter.selectedStatus,
  selectedManager: state.filter.selectedManager,
  filterButton: state.filter.filterButton
});
  
  const mapDispatchToProps = dispatch => {
    return bindActionCreators({
      ...filterActions, ...mapActions
    }, dispatch);
  } 

export default connect(mapStateToProps, mapDispatchToProps, null, {context:StoreContext}) (FilterComponent);