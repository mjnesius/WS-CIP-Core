// Copyright 2019 Esri
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//     http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.​

// React
import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Components
import Loader from 'calcite-react/Loader';
import background from '../styles/images/Topo-Abs-BG.svg';
//import logo from '../styles/images/Esri-React-Logo.svg';
import logo from '../styles/images/Logo.svg';

// Styled Components
import styled, { keyframes } from 'styled-components';

const fadeOut = keyframes`
  0%   {opacity: 1;}
  100% {opacity: 0;}
`;

const Container = styled.div`
  position: absolute;
  z-index: 10;
  height: 100%;
  width: 100%;
  background: rgba(255,255,255,0.1) url(${background}) no-repeat center/cover;
  background-blend-mode: screen;
`;

const FadingContainer = styled(Container)`
  animation-name: ${fadeOut};
  animation-duration: ${props => props.delay};
  animation-timing-function: ease-in-out;
  animation-delay: ${props => props.duration};
`;

const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%);
`;
// position: absolute;
//   right: 0;
//   bottom: 0;

//   display: flex;
//   align-items: center;
//   justify-content: flex-end;
const Title = styled.div `
  z-index: 20;
  width: 100%;
  padding: 2em;
  text-align: right;
  color: white;
  float: none;
  margin: 0 auto;
`;
// display: 'flex';
//   justifyContent: 'center'
const Label = styled.h1 `
  font-size: 3em;
  text-shadow: -2px 2px 8px rgba(0,0,0,0.25);
  float: none;
  margin: 0 auto;
  align-items:center;
  align-content: center
`;


// margin-right: 1em;
// display: 'flex';
// justifyContent: 'center'
const Logo = styled.img `
  width: 15em;
  height: 100%;
  float: none;
  margin: 0 auto;
  align-items:center;
  align-content: flex-end
`;

// Animation durations in millisecondss -- Change these to adjust animation
const delayAmount = 1000;
const durationAmount = 1000;
// Animation calculations
const animationPeriod = delayAmount + durationAmount;
const animationDelay = delayAmount + 'ms';
const animationDuration = durationAmount + 'ms';

class LoadScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { isAnimating: true }
  }

  // Run animation timer
  playAnimation = () => {
    setTimeout(() => {
      this.setState({
        isAnimating: false
      });
    }, animationPeriod);
  }

  render() {
    if (!this.props.isLoading && this.state.isAnimating) {
      return (
        <Container>
          <Wrapper>
            <Loader />
          </Wrapper>
          <Row></Row>
          <Row className="show-grid">
            <Col xs={7}>
              <Title>
              <Logo src={logo} ></Logo>
              <Label>Water-Sewer CIP</Label>
            </Title>
            </Col>
            
          </Row>
        </Container>
      )
    } else if (this.props.isLoading && this.state.isAnimating) {
      this.playAnimation();
      return (
        <FadingContainer delay={animationDelay} duration={animationDuration}/>
      )
    }

    return null;
  }
}

export default LoadScreen
