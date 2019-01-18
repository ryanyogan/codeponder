import { Component } from "react";
import { Formik, Field } from "formik";
import { InputField } from "../components/formik-fields/InputField";
import { Query } from "react-apollo";
import gql from "graphql-tag";

interface FormValues {
  username: string;
}

export default class PickUsername extends Component {
  render() {
    return (
      <Query
        query={gql`
          {
            me {
              username
            }
          }
        `}
      >
        {({ data, loading }) => {
          if (loading) {
            return null;
          }

          return (
            <Formik<FormValues>
              initialValues={{ username: data.me.username }}
              onSubmit={async (values, { setSubmitting }) => {
                console.log(values);
              }}
            >
              {({ handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit}>
                  <Field name="username" component={InputField} />
                  <button disabled={isSubmitting} type="submit">
                    Submit
                  </button>
                </form>
              )}
            </Formik>
          );
        }}
      </Query>
    );
  }
}
