import * as React from "react";

import { Button } from "@codeponder/ui";

export default class Home extends React.PureComponent {
  render() {
    return (
      <a href="http://localhost:4000/auth/github">
        <Button>Login with github</Button>
      </a>
    );
  }
}
