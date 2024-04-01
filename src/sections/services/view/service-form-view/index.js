import { ServiceFormProvider } from './context';
import ServiceFormWizard from './wizard';

export default function ServiceFormView() {
  return (
    <ServiceFormProvider>
      <ServiceFormWizard />
    </ServiceFormProvider>
  );
}
