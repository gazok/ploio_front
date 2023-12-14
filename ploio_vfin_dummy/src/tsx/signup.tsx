import React from 'react';
import { Button, Checkbox, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Dropdown, Input, Label, Link, Option, ProgressBar, Slider, Textarea, makeStyles, shorthands, tokens, useId } from '@fluentui/react-components';
import { PersonRegular, LockClosedRegular, ArrowRightRegular, ArrowForwardDownPersonRegular } from '@fluentui/react-icons'
import { useLocation } from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    // Stack the label above the field
    display: "flex",
    flexDirection: "column",
    // Use 2px gap below the label (per the design system)
    ...shorthands.gap("2px"),
    // Prevent the example from taking the full width of the page (optional)
    maxWidth: "200px",
  },
  root2: {
    // Stack the label above the field
    display: "flex",
    flexDirection: "row",
    // Use 2px gap below the label (per the design system)
    ...shorthands.gap("2px"),
    // Prevent the example from taking the full width of the page (optional)
    maxWidth: "100px",
  },
  field: {
    display: "grid",
    gridRowGap: "5px",
    ...shorthands.padding(tokens.spacingHorizontalMNudge),
  },
  sections: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap("20px"),
  },
  dialog: {
    height: "600px",
  },
  dialogbody: {
    width: "100%",
    height: "100%",
  },
  textarea: {
    width: "100%",
    height: "100%",
  },
  slider: {
    
  },
  progressbar: {
    width: "80%",
  },
  dropdown: {
    maxWidth: "30px",
  }
});

export const SignupPage1: React.FC = () => {
  const styles = useStyles();

  return (
    <div className="content">
      <div className={styles.sections}>
        <h2>Step 1: Terms of Use and Policies</h2>
        <ProgressBar value={0.25} className={styles.progressbar}></ProgressBar>
        <section>
          Policy1
          <Dialog>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="transparent">Read</Button>
            </DialogTrigger>

            <DialogSurface className={styles.dialog}>
              <DialogBody className={styles.dialogbody}>
                <DialogTitle>Sample dialog</DialogTitle>

                <DialogContent>
                  <Textarea disabled className={styles.textarea}>
                    {'content1'}
                  </Textarea>

                  </DialogContent>
                  <DialogActions>
                  <DialogTrigger disableButtonEnhancement>
                    <Button appearance="secondary">Close</Button>
                  </DialogTrigger>
                </DialogActions>
              </DialogBody>
            </DialogSurface>
          </Dialog>
          <Checkbox required label={"Required"}></Checkbox>
        </section>

        <section>
          Policy2
          <Dialog>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="transparent">Read</Button>
            </DialogTrigger>

            <DialogSurface className={styles.dialog}>
              <DialogBody className={styles.dialogbody}>
                <DialogTitle>Sample dialog</DialogTitle>

                <DialogContent>
                  <Textarea disabled className={styles.textarea}>
                    {'content2'}
                  </Textarea>

                  </DialogContent>
                  <DialogActions>
                  <DialogTrigger disableButtonEnhancement>
                    <Button appearance="secondary">Close</Button>
                  </DialogTrigger>
                </DialogActions>
              </DialogBody>
            </DialogSurface>
          </Dialog>
          <Checkbox required label={"Required"}></Checkbox>
        </section>

        <a href={`./su2`}>
            <Button appearance='primary' icon={<ArrowRightRegular />} iconPosition="after">Next step</Button>
        </a>
      </div>
    </div>
  );
}

export function SignupPage2() {
  const styles = useStyles();

  return (
    <div className="content">
      <div className={styles.sections}>
      <h2>Step 2: Personal Info</h2>
      <ProgressBar value={0.5} className={styles.progressbar}></ProgressBar>
      <div className={styles.root}>
        <form method="post" action="#" id="signup-form-s2" className={styles.root}>
          <div className={styles.root2}>
            <div className={styles.field}>
              <Label htmlFor={'su-lastname'} required>Last Name</Label>
              <Input appearance="outline" id={'su-lastname'} required/>
            </div>
            <div className={styles.field}>
              <Label htmlFor={'su-firstname'} required>First Name</Label>
              <Input appearance="outline" id={'su-firstname'} required/>
            </div>
          </div>
          
          <p>Birth</p>
          <div className={styles.root2}>
            <div className={styles.field}>
              <Label htmlFor={'su-year'} required>Year</Label>
              <Dropdown placeholder='Select year' className={styles.dropdown}>
                <Option>year1</Option>
                <Option>year2</Option>
              </Dropdown>
            </div>
            <div className={styles.field}>
              <Label htmlFor={'su-month'}>Month</Label>
              <Dropdown placeholder='Select month' className={styles.dropdown}>
                <Option>m1</Option>
                <Option>m2</Option>
              </Dropdown>
            </div>
            <div className={styles.field}>
              <Label htmlFor={'su-date'}>Date</Label>
              <Dropdown placeholder='Select date' className={styles.dropdown}>
                <Option>d1</Option>
                <Option>d2</Option>
              </Dropdown>
            </div>
          </div>
          <Button type='submit'>교체될 예정</Button>
        </form>

        <form method="post" action="#" id="su2-form-email" className={styles.root}>
          <div className={styles.field}>
            <Label htmlFor={'su-email'} required>Email Address</Label>
            <Input appearance='outline' placeholder='Your email' required></Input>
          </div>
          <Button appearance='transparent'>Verify your email</Button>
        </form>
        <a href={`./su3`}>
            <Button type='submit' appearance='primary' icon={<ArrowRightRegular />} iconPosition="after">Next step</Button>
        </a>
      </div>
      </div>
    </div>
  );
}

export function SignupPage3() {
  const inputId = useId("input");
  const inputPw = useId("password");
  const styles = useStyles();

  return (
    <div className="content">
      <div className={styles.sections}>
      <h2>Step 3: Account Info</h2>
      <ProgressBar value={0.75} className={styles.progressbar}></ProgressBar>
      <div className={styles.root}>
        <form method="post" action="#" id="signup-form-s3">
          <div className={styles.field}>
            <div>
              <Label htmlFor={inputId} required>UserID</Label>
              <Input contentBefore={<PersonRegular />} appearance="outline" id={inputId} required/>
            </div>
          </div>
          <div className={styles.field}>
            <Label htmlFor={inputPw} required>Password</Label>
            <Input contentBefore={<LockClosedRegular />} appearance="outline" id={inputPw} type="password" required/>
          </div>
          <a href='./su4'>
            <Button type='submit' appearance='primary' icon={<ArrowForwardDownPersonRegular />} iconPosition="after">Register</Button>
          </a>
        </form>
        
        <a href='./su4'>
          <Button appearance='primary' icon={<ArrowForwardDownPersonRegular />} iconPosition="after">Register</Button>
        </a>
      </div>
      </div>
    </div>
  );
}

export function SignupPage4() {
    const inputId = useId("input");
    const inputPw = useId("password");
    const styles = useStyles();
  
    return (
      <div className="content">
        <h2>Congratulations! You are now ~</h2>
        <ProgressBar value={1} className={styles.progressbar}></ProgressBar>
        <div className={styles.root}>
  
          <a href='/'>
            <Button appearance='primary' icon={<ArrowForwardDownPersonRegular />} iconPosition="before">Go to Home</Button>
          </a>
        </div>
      </div>
    );
  }

export function Signup() {
  const location = useLocation();

  return (
    <div className="content">
      <div className=''>
        <h2>Sign Up</h2>
        <br></br>
        <a href={`${location.pathname}/su1`}>
          <Button appearance='primary' icon={<ArrowRightRegular />} iconPosition="after">Next step</Button>
        </a>
      </div>
    </div>
);
}