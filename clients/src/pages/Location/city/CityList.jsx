
const CityTable = ({ cities, onDeleteCity, onEditCity }) => (
    <div className="my-3">
        <h5>Cities</h5>
        <table className="table table-bordered">
            <thead>
                <tr>
                    <th>#</th>
                    <th>City</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {cities.map((city, i) => (
                    <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{city}</td>
                        <td>
                            <button className="btn btn-sm btn-primary me-2" onClick={() => onEditCity(city)}>Edit</button>
                            <button className="btn btn-sm btn-danger" onClick={() => onDeleteCity(city)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default CityTable;