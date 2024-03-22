const NoDataComponent = ({ message = "No data available" }) => {
  return (
    <div className="d-flex justify-content-center align-items-center pt-5 pb-3 rounded" style={{ paddingTop: '200px', paddingBottom: '50px' }}>
      <p className="text-dark fw-semibold fs-1">{message}</p>
    </div>
  );
};

export default NoDataComponent;
