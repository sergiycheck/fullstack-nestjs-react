export const UserForm = ({
  username,
  onUserNameChanged,
  canSave,
  saveDataClicked,
}: {
  username: string;
  onUserNameChanged: (event: any) => void;
  canSave: boolean;
  saveDataClicked: (event: any) => void;
}) => {
  return (
    <form className="mb-3" autoComplete="off">
      <label className="form-label" htmlFor="userName">
        Username:
      </label>
      <input
        type="text"
        id="userName"
        name="userName"
        className="form-control"
        value={username}
        onChange={onUserNameChanged}
      />

      <div className="row justify-content-end mt-2">
        <div className="col-auto">
          <button
            className=" btn  border border-primary rounded "
            disabled={!canSave}
            onClick={saveDataClicked}
            type="button"
          >
            Save user
          </button>
        </div>
      </div>
    </form>
  );
};
