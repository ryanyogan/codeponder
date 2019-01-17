import * as React from "react";

import { storiesOf } from "@storybook/react";
import { Button } from ".";
import { action } from "@storybook/addon-actions";

storiesOf("Button", module)
  .add("with text", () => <Button>Text</Button>)
  .add("with an action", () => (
    <Button onClick={action("clicked")}>Action Click</Button>
  ));
