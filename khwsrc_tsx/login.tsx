import React from 'react';
import './login.css';
import { Menubar, Top } from './background';
import { Input, Label, makeStyles, shorthands, tokens, useId } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    // Stack the label above the field
    display: "flex",
    flexDirection: "column",
    // Use 2px gap below the label (per the design system)
    ...shorthands.gap("2px"),
    // Prevent the example from taking the full width of the page (optional)
    maxWidth: "400px",
  },
  field: {
    display: "grid",
    gridRowGap: tokens.spacingVerticalXXS,
    marginTop: tokens.spacingVerticalMNudge,
    ...shorthands.padding(tokens.spacingHorizontalMNudge),
  },
  filledLighter: {
    backgroundColor: tokens.colorNeutralBackgroundInverted,
    "> label": {
      color: tokens.colorNeutralForegroundInverted2,
    },
  },
  filledDarker: {
    backgroundColor: tokens.colorNeutralBackgroundInverted,
    "> label": {
      color: tokens.colorNeutralForegroundInverted2,
    },
  },
});

function Login() {
  const outlineId = useId("input-outline");
  const inputId = useId("input");
  const inputPw = useId("password");
  const styles = useStyles();

  return (
    <div className="app">
      <Menubar />
      <Top />
      <div className="content">
        <h2>Login</h2>
        <div className={styles.root}>
          <form method="post" action="#" id="login-form">
            <div className={styles.field}>
              <Label htmlFor={outlineId}>UserID</Label>
              <Input appearance="outline" id={outlineId} />
            </div>

          </form>
        </div>
      </div>
    </div>
);
}
//"form-group"

export default Login;