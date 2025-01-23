import parseArgs from 'minimist';

const {
  count = 31,
  vid = 1,
  rate = 1,
  start = '2024-01-01',
  maxkwh = 100
  // eslint-disable-next-line no-undef
} = parseArgs(process.argv.slice(2));

const writeln = (...msg) => {
  console.log(...msg);
};

try {
  writeln(
    `Args: count: ${count}, start-date: ${start}, vid: ${vid}, rate: ${rate}, maxKwh: ${maxkwh}\n\n`
  );

  const startDate = new Date(start);

  writeln(`INSERT INTO sessions (vehicle_id, rate_type_id, date, kwh) VALUES`);

  for (let i = 1; i <= count; i++) {
    const last = count === i;
    const date = startDate.toISOString().split('T')[0];
    const kwh = (Math.random() * maxkwh || 42).toFixed(0);

    writeln(`(${vid}, ${rate}, '${date}', ${kwh})${last ? ';' : ','}`);

    startDate.setDate(startDate.getDate() + 1);
  }
} catch (error) {
  console.error(error);
}