import React from 'react';
import { Button, Caption1, Card, CardHeader, CardPreview, Image, Input, Label, Link, Subtitle1, Text, makeStyles, shorthands, tokens, useId } from '@fluentui/react-components';
import { MoreHorizontal20Regular} from '@fluentui/react-icons';

const useStyles = makeStyles({
  field: {
    display: "grid",
    gridRowGap: "5px",
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

  card: {
    width: "330px",
    maxWidth: "100%",
    height: "fit-content",
    ...shorthands.margin(0, 0, "20px"),
  },
  section: {
    width: "fit-content",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-55%, -60%)",
    
  },
  title: {
    ...shorthands.margin(0, 0, "12px"),
    textAlign: "center",
  },
  horizontalCardImage: {
    width: "64px",
    height: "64px",
  },
  headerImage: {
    ...shorthands.borderRadius("4px"),
    maxWidth: "44px",
    maxHeight: "44px",
  },
  image: {
    maxWidth: "100px",
    maxHeight: "100px",
  },

  a_button_signin: {
    alignSelf: "center",
    width: "94.5%",
  },
  button: {
    alignSelf: "center",
    width: "100%",
    marginTop: "10px",
  }
});
//use card footer?

const Login = () => {
  const inputId = useId("input");
  const inputPw = useId("password");
  const styles = useStyles();

  return (
    <div className="content">
      <section className={styles.section}>
        <div className={styles.title}>
          <img className={styles.image} src="shipicon.png" alt="Appicon" />
          <h2>Sign in to Ploio</h2>
        </div>
        
        <Card className={styles.card}>
          <form method="post" action="#" id="login-form">
            <div className={styles.field}>
              <Label htmlFor={inputId}>UserID</Label>
              <Input appearance="outline" id={inputId} />
            </div>
            <div className={styles.field}>
              <Label htmlFor={inputPw}>Password</Label>
              <Input appearance="outline" id={inputPw} type="password" />
            </div>
          </form>

          <a href='/' className={styles.a_button_signin}>
            <div>
              <Button appearance='primary' className={styles.button}>Sign in</Button>
            </div>
          </a>
        </Card>

        <Card className={styles.card}>
          <p>If you are new to Ploio, click this.</p>
          <a href='/signup' className={styles.a_button_signin}>
            <div>
              <Button appearance='primary' className={styles.button}>Create new account</Button>
            </div>
          </a>
        </Card>
      </section>
    </div>
  );
};

export default Login;


