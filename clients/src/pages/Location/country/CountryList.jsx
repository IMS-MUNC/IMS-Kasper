const CountryTable = ({ countries }) => (
    <div className="my-3">
        <h5>Countries</h5>
        <table className="table table-bordered">
            <thead><tr><th>#</th><th>Country</th></tr></thead>
            <tbody>
                {countries.map((c, i) => (
                    <tr key={i}><td>{i + 1}</td><td>{c}</td></tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default CountryTable;