import React from "react";
import "./App.css";
import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger } from "@fluentui/react-components";

export const MainBeforeLogIn: React.FC = () => {
  return (
    <main className="content">
      <p>Welcome to your dashboard</p>
      <p>You must sign in to run this app normally.</p>
      <Dialog>
        <DialogTrigger disableButtonEnhancement>
          <Button appearance="primary">Sign in</Button>
        </DialogTrigger>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Sample dialog</DialogTitle>
            <DialogContent>
              You can ignore this.
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Close</Button>
              </DialogTrigger>
              <Button appearance="primary">Do Something</Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </main>
  );
}

export const MainAfterLogIn: React.FC = () => {
  return (
    <main className="content">Welcome to your dashboard</main>
  );
}
