import { Button, Caption1, Card, CardHeader, Input, Label, Text, makeStyles, shorthands, tokens, useId } from '@fluentui/react-components';
import { MoreHorizontal20Regular } from '@fluentui/react-icons'
import React from 'react';

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
    width: "550px",
    maxWidth: "100%",
    height: "fit-content",
    ...shorthands.margin(0, 0, "20px"),
  },
  section: {
    width: "fit-content",
    position: "absolute",
    top: "15%",
    left: "15%",
    
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
  logo: {
    ...shorthands.borderRadius("4px"),
    width: "48px",
    height: "48px",
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

const Management: React.FC = () => {
  const inputId = useId("input");
  const inputPw = useId("password");
  const styles = useStyles();
  
  return (
    <div className='content'>
      Management Page

      <section className={styles.section}>
        <Card className={styles.card}>
          <CardHeader 
            image={<img className={styles.logo} src={"shipicon.png"} alt="App name logo" />}
            header={<Text weight="semibold">App Name</Text>}
            description={<Caption1 >Developer</Caption1>}
            action={
              <Button
                appearance="transparent"
                icon={<MoreHorizontal20Regular />}
                aria-label="More options"
              />
            }
          />
          <Label>Description<br></br>#1 Card</Label>
        </Card>

        <Card className={styles.card}>
          <p>Card2</p>
        </Card>

        <Card className={styles.card}>
          <p>Card3</p>
        </Card>
      </section>
    </div>
  );
}

export default Management;
