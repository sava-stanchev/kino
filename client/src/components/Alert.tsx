import Alert from "react-bootstrap/Alert";
import { AlertDismissibleProps } from "src/types";

const AlertDismissible: React.FC<AlertDismissibleProps> = ({
    active,
    msg = "Something went wrong!",
    onClose,
}) => {
    if (!active)
        return null;

    return (
        <Alert variant="danger" onClose={onClose} dismissible>
            <span className="small">{msg}</span>
        </Alert>
    );
};

export default AlertDismissible;
