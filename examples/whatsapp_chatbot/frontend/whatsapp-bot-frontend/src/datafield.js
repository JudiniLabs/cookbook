// DataField.js
const DataField = ({ label, value, editMode, onEditClick, onCancelClick, children }) => (
    <div className="data-field">
      <label>{label}:</label>
      {editMode ? (
        <>
          {children}
          <button onClick={onCancelClick}>X</button>
        </>
      ) : (
        <span>{value} <button onClick={onEditClick}>Editar</button></span>
      )}
    </div>
  );
  
  export default DataField;