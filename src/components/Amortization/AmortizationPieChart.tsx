
import { Cell, Pie, PieChart, ResponsiveContainer, Legend, Sector } from "recharts"
import React, { JSX, useMemo } from "react"
import { Decimal } from "decimal.js"
import { Period } from "./AmortizationLayout"
import colors from 'tailwindcss/colors'
import { PieSectorDataItem } from "recharts/types/polar/Pie"

interface AmortizationPieChartProps {
  periods: Period[]
}

const AmortizationPieChart: React.FC<AmortizationPieChartProps> = React.memo(({ periods }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const totalPrincipalPaid: Decimal = useMemo(
    () => periods.reduce<Decimal>((acc, current) => acc.plus(current.principalDue || 0), new Decimal(0)),
    [periods]
  )

  const totalInterestPaid: Decimal = useMemo(
    () => periods.reduce<Decimal>((acc, current) => acc.plus(current.interestDue || 0), new Decimal(0)),
    [periods]
  )

  const totalAmountPaid: Decimal = totalPrincipalPaid.plus(totalInterestPaid)

  const initialLoanAmount: Decimal = useMemo(
    () => new Decimal(periods.length > 0 ? periods[0].remainingBalance.plus(totalAmountPaid) : 0),
    [periods, totalAmountPaid]
  )

  const remainingBalance: Decimal = useMemo(() => initialLoanAmount.minus(totalAmountPaid), [initialLoanAmount, totalAmountPaid])

  if (periods.length < 1) {
    return null
  }

  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Data for Donut Chart with consistent colors
  const data = [
    { name: "Principal Paid", value: totalPrincipalPaid.toNumber(), color: colors.indigo[900] },
    { name: "Interest Paid", value: totalInterestPaid.toNumber(), color: colors.indigo[600] },
    { name: "Remaining Balance", value: remainingBalance.toNumber(), color: colors.indigo[300] },
  ]

  // Enhanced active sector rendering for professional look
  const renderActiveShape = (props: PieSectorDataItem): JSX.Element => {
    const {
      cx = 0,
      cy = 0,
      innerRadius,
      outerRadius = 0,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value
    } = props as PieSectorDataItem & {
      payload: { name: string; value: number };
      percent: number;
      value: number;
    };

    return (
      <g>
        <text x={cx} y={cy - 15} dy={8} textAnchor="middle" fill="#333" className="text-lg font-semibold">
          {payload.name}
        </text>
        <text x={cx} y={cy + 15} dy={8} textAnchor="middle" fill="#333" fontWeight={500}>
          {formatCurrency(value)}
        </text>
        <text x={cx} y={cy + 40} dy={8} textAnchor="middle" fill="#666">
          {`${(percent * 100).toFixed(1)}%`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 15}
          outerRadius={outerRadius + 20}
          fill={fill}
        />
      </g>
    );
  };

  const onPieEnter = (_: React.MouseEvent, index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="min-w-full bg-white rounded-lg shadow">
      <div className="flex flex-col items-center justify-center w-full p-4">
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              fill={colors.indigo[900]}
              dataKey="value"
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              onMouseEnter={onPieEnter}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{
                fontSize: "14px",
                fontWeight: "bold",
                marginTop: "10px",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
})

export default AmortizationPieChart
