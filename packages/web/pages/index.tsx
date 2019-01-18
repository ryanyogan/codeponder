import * as React from "react";
import gql from "graphql-tag";
import { NextContextWithApollo } from "../types/NextContextWithApollo";

export default class Index extends React.PureComponent {
  static async getInitialProps({ apolloClient }: NextContextWithApollo) {
    const response = await apolloClient.query({
      query: gql`
        {
          me {
            id
            username
            pictureUrl
            bio
          }
        }
      `,
    });

    // @ts-ignore
    return response.data.me;
  }

  render() {
    return <div>{JSON.stringify(this.props, null, 2)}</div>;
  }
}
