// COT navy cmyk: 100, 57, 0, 40
import React from 'react'; //, { Component }
import Search from 'calcite-react/Search';
import { CalciteTheme } from 'calcite-react/CalciteThemeProvider';
import MagnifyingGlassIcon from 'calcite-ui-icons-react/MagnifyingGlassIcon';
import XCircleIcon from 'calcite-ui-icons-react/XCircleIcon';

//import { useContext } from 'react';
//import { ThemeContext } from 'styled-components';

//import moment from 'moment';

//redux
import { bindActionCreators } from 'redux';
import { actions as attributeActions } from '../redux/reducers/attributes';
import { actions as mapActions } from '../redux/reducers/map';

import { actions as filterActions } from '../redux/reducers/filters';
import { parseContractorData, parseEmployeesData, parseDomainValues, parseProjectData } from '../redux/selectors';
import{StoreContext} from "./StoreContext";
import { connect } from 'react-redux';

// ,{ PanelTitle, PanelText }
import Panel from 'calcite-react/Panel';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

 import styled from 'styled-components';
 const StyledSearch = styled(Search)`
    color: white;
    ::placeholder,
    ::-webkit-input-placeholder {
        color: white;
    }
    :-ms-input-placeholder {
        color: white;
    }
 `;

class SearchComponent extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            inputValue: '',
            selectedItem: this.setSelectedItem ? this.setSelectedItem : '',
            type:''
        }

        this.searchChanged = this.searchChanged.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
        this.onUserAction = this.onUserAction.bind(this);
        this.setSelectedItem = this.setSelectedItem.bind(this);
    }

    searchChanged(e) {
        console.log("search changed, e: ", e);
        this.setState({
            selectedItem: e,
        });
        if (this.props.type.includes('contractor')){
            const contractor = this.props.contractors.filter(item => item['Contractor'].toUpperCase().includes(e.toUpperCase()))
            console.log("contractor obj: ", contractor);
            this.props.setSelected(contractor[0], 'contractors')
        } else if (this.props.type.includes('employees')){
            const employees = this.props.employees.filter(item => item['Name'].toUpperCase().includes(e.toUpperCase()))
            console.log("employees obj: ", employees);
            this.props.setSelected(employees[0], 'employees')
        } else if (this.props.type.includes('projects')){
            const projects = this.props.projects.filter(item => item['Project_Name'] ? item['Project_Name'].toUpperCase().includes(e.toUpperCase()): '')
            console.log("projects obj: ", projects);
            this.props.selectFeature(projects[0], 'projects')
        }
        
    }

    clearSearch() {
        console.log("clearSearch");
        this.setState({
            inputValue: '',
            selectedItem: '',
        })
        if (this.props.type.includes('contractor')){
            this.props.setSelected({}, 'contractors')
        } else if (this.props.type.includes('employees')){
            this.props.setSelected({}, 'employees')
        } else if (this.props.type.includes('projects')){
            this.props.selectFeature({}, 'projects')
        }
        this.props.setSaveButton("deactivate");

    }

    onUserAction(inputValue, selectedItemVal) {
        console.log("onUserAction, val: ", inputValue, "\tselectedItemval: ", selectedItemVal);
        this.setState({
            inputValue: inputValue,
            selectedItem: selectedItemVal,
        });
    }
    setItems() {
        console.log("set items");
        if (this.props.type.includes('contractor')){
            return this.props.contractors.map(con => con['Contractor'])
        } else if (this.props.type.includes('employees')){
            return this.props.employees.map(emp => emp['Name'])
        } else if (this.props.type.includes('projects')){
            return this.props.projects.map(proj => proj['Project_Name'])
        }
        
    }
    setSelectedItem() {
        if (this.props.type.includes('contractor')){
            console.log("setSelectedItem() , ",this.props.selectedContractor['Contractor'] );
            return this.props.selectedContractor['Contractor'] ? this.props.selectedContractor['Contractor'] : '';
        } else if (this.props.type.includes('employees')){
            
            console.log("setSelectedItem() , ",this.props.selectedEmployee['Name'] );
            return this.props.selectedEmployee['Name'] ? this.props.selectedEmployee['Name'] : '';
        } else if (this.props.type.includes('projects')){
            
            console.log("setSelectedItem() , ",this.props.selectedProject['Project_Name'] );
            return this.props.selectedProject['Project_Name'] ? this.props.selectedProject['Project_Name']: '';
        }
        
    }

    componentDidMount() {
        var item = this.setSelectedItem()//''
        // if (this.props.type.includes('contractors')){
        //     item = this.props.selectedContractor['Contractor'] ? this.props.selectedContractor['Contractor'] : '';
        // } else if (this.props.type.includes('employees')) {
        //     item = this.props.selectedEmployee['Name'] ? this.props.selectedEmployee['Name'] : '';
        // } else if (this.props.type.includes('projects')) {
        //     item = this.props.selectedProject['Project_Name'] ? this.props.selectedProject['Project_Name'] : '';
        // }

        this.setState({
            selectedItem: item,
        });
      }

    render() {
        var items = this.setItems();
        var selectedItem = this.setSelectedItem();
        //props.theme.palette.COTblue
        return (
            <div className="container-fluid" style={{padding: "0px", backgroundColor: "transparent"}} >
                <Row className="m-0 p-0"> 
                    <Panel noBorder noPadding style={{flex: 1}}>
                        <Col lg="12" className="m-0 p-0">
                            <StyledSearch style={{color: CalciteTheme.palette.white}}
                                fullWidth
                                minimal
                                placement = "bottom"
                                inputValue={this.state.inputValue}
                                selectedItem= {selectedItem}/*{this.props.selectedContractor}*/
                                items={items} /* {this.props.contractors.map(con => con['Contractor'])} */
                                onChange={this.searchChanged}
                                onUserAction={this.onUserAction}
                                onRequestClear={this.clearSearch}
                                searchIcon={
                                    <MagnifyingGlassIcon
                                      filled
                                      size={16}
                                      color={CalciteTheme.palette.white}
                                    />
                                  }
                                  clearIcon={
                                    <XCircleIcon
                                      filled
                                      size={16}
                                      color={CalciteTheme.palette.white}
                                    />
                                  }
                                  containerStyle ={{backgroundColor: CalciteTheme.palette.lightBlue,
                                    color: 'white'
                                }}
                                menuStyle ={{backgroundColor: CalciteTheme.palette.lightBlue,
                                    color: CalciteTheme.palette.blue
                                }}
                            />
                        </Col>
                    </Panel>
                </Row>
            
            </div>
        )
    }
}

//SearchComponent.contextType = ThemeContext;

const mapStateToProps = state => ({
    employees: parseEmployeesData(state),
    contractors: parseContractorData(state),
    selectedContractor: state.attributes.selectedContractor,
    selectedEmployee: state.attributes.selectedEmployee,
    saveButton: state.attributes.saveButton,
    domains: parseDomainValues(state),
    optionsManagers: state.map.managers,
    projects: parseProjectData(state),
    selectedProject: state.map.selectedFeature,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        ...filterActions, ...mapActions, ...attributeActions
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps, null, {context:StoreContext}) (SearchComponent);