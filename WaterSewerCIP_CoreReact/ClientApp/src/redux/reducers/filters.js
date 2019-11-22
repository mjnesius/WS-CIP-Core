
export const types = {
    SET_FILTER_YEARS: "SET_FILTER_YEARS",
    SET_FILTER_STATUS: "SET_FILTER_STATUS",
    SET_FILTER_MANAGER: "SET_FILTER_MANAGER",
    SET_DEF_EXPRESSION: "SET_DEF_EXPRESSION",
    FILTER_BUTTON: "FILTER_BUTTON"
  };
  

export const initialState = {
    selectedYear: "%",
    selectedStatus: "%",
    selectedManager: "%",
    defExp:"(1=1)",
    filterButton: true
}

// REDUCERS //
export default (state = initialState, action) => {
  
  switch (action.type) {
    
    case types.SET_FILTER_YEARS:
      return {
        ...state,
        selectedYear: action.payload.filter
      };
    case types.SET_FILTER_STATUS:
      return {
        ...state,
        selectedStatus: action.payload.filter
      };
    case types.SET_FILTER_MANAGER:
        return {
          ...state,
          selectedManager: action.payload.filter
        };
    case types.FILTER_BUTTON:
      return {
        ...state,
        filterButton: !state.filterButton
      };
    case types.SET_DEF_EXPRESSION:
      var defExp = "(Status Like '%" + state.selectedStatus + "%'" 
        +  ((state.selectedStatus === "null" || state.selectedStatus === "%" || state.selectedStatus === "") ? " OR Status IS NULL  OR Status = '')" : ")") 
        + " AND (Project_Manager Like '%" + state.selectedManager  + "%'" 
        + ((state.selectedManager === "null" || state.selectedManager === "%" || state.selectedManager === "") ? " OR Project_Manager IS NULL OR Project_Manager = '')" : ")") 
        + " AND (Proposed_Year Like '%" + state.selectedYear + "%'" 
        + ((state.selectedYear === "null" || state.selectedYear === "%" || state.selectedYear === "") ? " OR Proposed_Year IS NULL OR Proposed_Year = '')" : ")") 
      return {
        ...state,
        defExp: defExp
      };    
    default:
      return state;
  }
}

// ACTION CREATORS //
export const actions = {
  setYear: filter => ({
    type: types.SET_FILTER_YEARS,
    payload: {
      filter
    }
  }),
  setStatus: filter => ({
    type: types.SET_FILTER_STATUS,
    payload: {
      filter
    }
  }),
  setManager: filter => ({
    type: types.SET_FILTER_MANAGER,
    payload: {
      filter
    }
  }),
  setDefExp: filter => ({
    type: types.SET_DEF_EXPRESSION,
  }),
  setFilterButton: filter => ({
    type: types.FILTER_BUTTON,
  })

};