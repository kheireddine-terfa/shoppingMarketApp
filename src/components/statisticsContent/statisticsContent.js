import React, { useState, useEffect } from 'react'
import Calendar from './Calendar'
import StatBox from './StatBox'
import BasicBarChart from './BasicBarChart'
import {
  FaDollarSign,
  FaMoneyBillWave,
  FaChartLine,
  FaCreditCard,
  FaChartBar,
} from 'react-icons/fa'
import axios from 'axios'
import dayjs from 'dayjs'

const StatisticsContent = () => {
  const [dailySales, setDailySales] = useState(0)
  const [monthlySales, setMonthlySales] = useState(0)
  const [dailyRevenues, setDailyRevenues] = useState(0)
  const [monthlyRevenues, setMonthlyRevenues] = useState(0)
  const [dailyCash, setDailyCash] = useState(0)
  const [monthlyCash, setMonthlyCash] = useState(0)
  const [dailyRemainingAmounts, setDailyRemainingAmounts] = useState(0)
  const [monthlyRemainingAmounts, setMonthlyRemainingAmounts] = useState(0)
  const [dailyIncome, setDailyIncome] = useState(0)
  const [monthlyIncome, setMonthlyIncome] = useState(0)
  // eslint-disable-next-line
  const [error, setError] = useState(null)

  // State variables for bar charts
  const [xAxisData1, setXAxisData1] = useState([])
  const [seriesData1, setSeriesData1] = useState([])
  const [xAxisData2, setXAxisData2] = useState([])
  const [seriesData2, setSeriesData2] = useState([])

  const handleDateChange = async (date) => {
    const formattedDate = date.format('YYYY-MM-DD')
    const currentMonth = formattedDate.substring(0, 7) // Extracts "YYYY-MM"

    try {
      const [
        dailySales,
        monthlySales,
        dailyRevenues,
        monthlyRevenues,
        dailyCash,
        monthlyCash,
        dailyRemainingAmounts,
        monthlyRemainingAmounts,
        dailyIncome,
        monthlyIncome,
        topUnbalancedProducts,
        topIncomedUnbalancedProducts,
      ] = await Promise.all([
        axios.get(`http://localhost:3001/api/sales/count/${formattedDate}`),
        axios.get(`http://localhost:3001/api/sales/count/${currentMonth}`),
        axios.get(
          `http://localhost:3001/api/sales/sum-paid-amounts/${formattedDate}`,
        ),
        axios.get(
          `http://localhost:3001/api/sales/sum-paid-amounts/${currentMonth}`,
        ),
        axios.get(
          `http://localhost:3001/api/sales/sum-total-amounts/${formattedDate}`,
        ),
        axios.get(
          `http://localhost:3001/api/sales/sum-total-amounts/${currentMonth}`,
        ),
        axios.get(
          `http://localhost:3001/api/sales/sum-remaining-amounts/${formattedDate}`,
        ),
        axios.get(
          `http://localhost:3001/api/sales/sum-remaining-amounts/${currentMonth}`,
        ),
        axios.get(
          `http://localhost:3001/api/sales/sum-total-incomes/${formattedDate}`,
        ),
        axios.get(
          `http://localhost:3001/api/sales/sum-total-incomes/${currentMonth}`,
        ),
        axios.get(
          `http://localhost:3001/api/sales/top-saled-unbalanced-products/${currentMonth}`,
        ),
        axios.get(
          `http://localhost:3001/api/sales/top-profit-unbalanced-products/${currentMonth}`,
        ),
      ])

      // Use fallback values (0) for any null or undefined data
      setDailySales(dailySales.data.salesCount || 0)
      setMonthlySales(monthlySales.data.salesCount || 0)
      setDailyRevenues(dailyRevenues.data.revenuesSum ? dailyRevenues.data.revenuesSum + ' DA' : '0 DA')
      setMonthlyRevenues(monthlyRevenues.data.revenuesSum ? monthlyRevenues.data.revenuesSum + ' DA' : '0 DA')
      setDailyCash(dailyCash.data.cash ? dailyCash.data.cash + ' DA' : '0 DA')
      setMonthlyCash(monthlyCash.data.cash ? monthlyCash.data.cash + ' DA' : '0 DA')
      setDailyRemainingAmounts(dailyRemainingAmounts.data.sumRemainingAmount ? dailyRemainingAmounts.data.sumRemainingAmount + ' DA' : '0 DA')
      setMonthlyRemainingAmounts(monthlyRemainingAmounts.data.sumRemainingAmount ? monthlyRemainingAmounts.data.sumRemainingAmount + ' DA' : '0 DA')
      setDailyIncome(dailyIncome.data.totalIncome ? dailyIncome.data.totalIncome + ' DA' : '0 DA')
      setMonthlyIncome(monthlyIncome.data.totalIncome ? monthlyIncome.data.totalIncome + ' DA' : '0 DA')

      // Set data for the first bar chart
      const products1 = topUnbalancedProducts.data.TopSaledProducts || []
      setXAxisData1([{ scaleType: 'band', data: products1.map((p) => p.name) }])
      setSeriesData1([{ data: products1.map((p) => p.total_quantity_sold) }])

      // Set data for the second bar chart
      const products2 = topIncomedUnbalancedProducts.data.topProfitableUnbalancedProducts || []
      setXAxisData2([{ scaleType: 'band', data: products2.map((p) => p.name) }])
      setSeriesData2([{ data: products2.map((p) => p.total_profit) }])

      setError(null)
    } catch (err) {
      console.error('Error fetching sales count:', err)
      setError('Failed to fetch sales count.')
      setDailySales(0)
      setMonthlySales(0)
      setDailyRevenues('0 DA')
      setMonthlyRevenues('0 DA')
      setDailyCash('0 DA')
      setMonthlyCash('0 DA')
      setDailyRemainingAmounts('0 DA')
      setMonthlyRemainingAmounts('0 DA')
      setDailyIncome('0 DA')
      setMonthlyIncome('0 DA')
    }
  }

  useEffect(() => {
    // Automatically set the current date when the component mounts
    const currentDate = dayjs()
    handleDateChange(currentDate)
  }, []) // Empty dependency array to run only on mount

  return (
    <div className="flex mt-20 gap-4 ml-2">
      {/* Calendar Column */}
      <div className="flex-1 bg-white shadow-lg h-auto mb-8 text-white p-2">
        <Calendar onDateChange={handleDateChange} />
      </div>

      {/* Stats Column */}
      <div className="flex-2 flex flex-col gap-0">
        {/* Top Row: Stat Boxes in Grid */}
        <div className="grid grid-cols-3 gap-4 h-4/6">
          <StatBox
            bgColor="bg-[#607D8B]"
            iconColor="text-white"
            title="Ventes"
            daily={dailySales}
            monthly={monthlySales}
            subtitle="Total Incomes"
            iconPath={<FaDollarSign className="h-8 w-8" />}
          />
          <StatBox
            bgColor="bg-[#FF9800]"
            iconColor="text-white"
            title="Caisse"
            daily={dailyRevenues}
            monthly={monthlyRevenues}
            subtitle="Total Cash"
            iconPath={<FaMoneyBillWave className="h-8 w-8" />}
          />
          <StatBox
            bgColor="bg-[#2196F3]"
            iconColor="text-white"
            title="Revenus total"
            daily={dailyCash}
            monthly={monthlyCash}
            subtitle="Total Revenues"
            iconPath={<FaChartLine className="h-8 w-8" />}
          />
          <StatBox
            bgColor="bg-[#F44336]"
            iconColor="text-white"
            title="Dépenses"
            daily={dailySales}
            monthly={monthlySales}
            subtitle="Total Expenses"
            iconPath={<FaCreditCard className="h-8 w-8" />}
          />
          <StatBox
            bgColor="bg-[#9C27B0]"
            iconColor="text-white"
            title="Crédit"
            daily={dailyRemainingAmounts}
            monthly={monthlyRemainingAmounts}
            subtitle="Total Credit"
            iconPath={<FaChartBar className="h-8 w-8" />}
          />
          <StatBox
            bgColor="bg-[#4CAF50]"
            iconColor="text-white"
            title="Bénifice"
            daily={dailyIncome}
            monthly={monthlyIncome}
            subtitle="Total Profit"
            iconPath={<FaDollarSign className="h-8 w-8" />}
          />
        </div>

        {/* Bottom Row: Bar Charts Side by Side */}
        <div className="flex flex-col gap-0 mb-8 ">
          <div className="flex gap-4">
            <div className="bg-white flex-1 h-76 shadow-xl">
              <h3 className="text-center text-black p-4">Produits les plus vendus</h3>
              <BasicBarChart xAxis={xAxisData1} series={seriesData1} />
            </div>
            <div className="bg-white flex-1 h-76 shadow-xl">
              <h3 className="text-center text-black p-4">Produits les plus rentables</h3>
              <BasicBarChart xAxis={xAxisData2} series={seriesData2} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatisticsContent
