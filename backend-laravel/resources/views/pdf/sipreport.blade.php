<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>{{ $goal->name }} - SIP Report</title>
  <style>
    body { font-family: DejaVu Sans, sans-serif; color: #333; }
    h1, h2 { text-align: center; color: #2c3e50; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    table, th, td {
      border: 1px solid #ccc;
    }
    th, td {
      padding: 8px;
      text-align: center;
    }
    th {
      background-color: #f4f4f4;
    }
    .chart {
      text-align: center;
      margin-top: 20px;
    }
  </style>
</head>
<body>

  <h1>{{ $goal->name }} - SIP Investment Report</h1>

  <h3>Summary</h3>
  <table>
    <tr><td><b>Monthly SIP</b></td><td>₹{{ number_format($goal->amount, 2) }}</td></tr>
    <tr><td><b>Duration</b></td><td>{{ $goal->duration }} years</td></tr>
    <tr><td><b>Return Rate</b></td><td>{{ $goal->return_rate }}%</td></tr>
  </table>

  <div class="chart">
    <img src="{{ $chartImage }}" alt="SIP Chart" style="width: 100%; max-width: 600px;">
  </div>

  <h3>Yearly Investment Growth</h3>
  <table>
    <thead>
      <tr>
        <th>Year</th>
        <th>Total Investment (₹)</th>
        <th>Value (₹)</th>
      </tr>
    </thead>
    <tbody>
      @foreach($yearlyData as $row)
        <tr>
          <td>{{ $row['year'] }}</td>
          <td>₹{{ number_format($row['totalInvestment'], 2) }}</td>
          <td>₹{{ number_format($row['value'], 2) }}</td>
        </tr>
      @endforeach
    </tbody>
  </table>

</body>
</html>
