export type OrderProgressUIProps = {
  steps: string[];
  activeStep: number;
  // доля прошедшего времени от 0 до 1
  progress: number;
  text: string;
};
