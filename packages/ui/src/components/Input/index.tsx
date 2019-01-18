import * as React from "react";
import styled from "styled-components";

const StyledInput = styled.input`
  font-size: 18px;
`;

export class Input extends React.PureComponent {
  render() {
    return <StyledInput {...this.props} />;
  }
}
