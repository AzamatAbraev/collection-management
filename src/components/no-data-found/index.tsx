import { useTranslation } from "react-i18next";

const NoDataComponent = () => {
  const { t } = useTranslation()
  return (
    <div className="nodata-page d-flex justify-content-center align-items-center pt-5 pb-3 rounded" style={{ paddingTop: '200px', paddingBottom: '50px' }}>
      <p className="text-dark fw-semibold fs-1">{t("No-Data")}</p>
    </div>
  );
};

export default NoDataComponent;
