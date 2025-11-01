<!DOCTYPE html>
<html>
<head>
    <title>Goal Report</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; color: #333; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 { color: #2563eb; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        td, th { border: 1px solid #ccc; padding: 8px; text-align: left; }
        .chart { text-align: center; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $name }}</h1>
        <p>Investment Goal Summary</p>
    </div>

    <table>
        <tr><th>Investment</th><td>₹{{ number_format($amount, 2) }}</td></tr>
        <tr><th>Return Rate</th><td>{{ $return_rate }}%</td></tr>
        <tr><th>Duration</th><td>{{ $duration }} months</td></tr>
        <tr><th>Expected Value</th><td>₹{{ number_format($expected_value, 2) }}</td></tr>
        @if($actual_value)
        <tr><th>Actual Value</th><td>₹{{ number_format($actual_value, 2) }}</td></tr>
        @endif
    </table>

  @if(!empty($chartImage))
<div class="chart">
    <h3>Performance Chart</h3>
    <img src="{{ $chartImage }}" alt="Chart" style="max-width: 100%; height: auto;">
</div>
@endif


    <p style="margin-top: 20px;">Generated on {{ date('d M Y') }}</p>
</body>
</html>
