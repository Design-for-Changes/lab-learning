export default function DataTable({
  headings, rows, caption, rowHeaders = true,
  tableClassName = '', scrollClassName = 'table-scroll', scrollLabel,
}) {
  return <div className={scrollClassName} tabIndex={scrollLabel ? 0 : undefined} role={scrollLabel ? 'region' : undefined} aria-label={scrollLabel}>
    <table className={['data-table', tableClassName].filter(Boolean).join(' ')}>
      {caption && <caption>{caption}</caption>}
      <thead><tr>{headings.map((heading, index) => <th key={index} scope="col">{heading}</th>)}</tr></thead>
      <tbody>{rows.map((row, index) => <tr key={index}>
        {row.map((cell, column) => rowHeaders && column === 0
          ? <th key={column} scope="row">{cell}</th>
          : <td key={column}>{cell}</td>)}
      </tr>)}</tbody>
    </table>
  </div>;
}
