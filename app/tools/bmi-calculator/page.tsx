import { BmiCalculatorTool } from "@/app/components/ToolComponents";

export const metadata = {
  title: "BMI Calculator | ToolNova",
  description: "Calculate BMI and health category based on your height and weight.",
};

export default function Page() {
  return <BmiCalculatorTool />;
}
