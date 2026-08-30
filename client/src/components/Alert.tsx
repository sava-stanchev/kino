import Alert from "react-bootstrap/Alert";
import { AlertDismissibleProps } from "src/types";

const AlertDismissible: React.FC<AlertDismissibleProps> = ({
  active,
  msg = "Something went wrong!",
}) => {
  if (!active) return null;

  return (
    <div className="position-absolute bottom-0">
      <Alert variant="danger" dismissible>
        <Alert.Heading>{msg}</Alert.Heading>
      </Alert>
    </div>
  );
};

export default AlertDismissible;
