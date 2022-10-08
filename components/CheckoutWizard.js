import { Step, StepLabel, Stepper } from '@mui/material'

const steps = ['Login', 'Shipping Address', 'Payment Method', 'Place Order']

const CheckoutWizard = ({ activeStep = 0 }) => {
  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {steps.map((step) => (
        <Step key={step}>
          <StepLabel>{step}</StepLabel>
        </Step>
      ))}
    </Stepper>
  )
}

export default CheckoutWizard
