import './style.scss';

const NoDataComponent = ({ message = "No data available" }) => {
  return (
    <div className="no-data-container">
      <p className="no-data-message">{message}</p>
    </div>
  );
};

export default NoDataComponent;
