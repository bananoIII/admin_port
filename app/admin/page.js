'use client'
// import node module libraries
import { Fragment } from "react";
import Link from 'next/link';
import { Container, Col, Row ,Spinner,Card, Dropdown} from 'react-bootstrap';
import { MoreVertical } from 'react-feather';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// import widget/custom components
import { HighlightCode }  from 'widgets';
import dynamic from 'next/dynamic';
// import react code data file
import {
	BorderSpinnerCode,
	SpinnersColorsCode,
	GrowingSpinnerCode,
	GrowColorsCode,
	AlignmentCode,
	PlacementCenterCode,
	PlacementLoadingCode,
	FloatsCode,
	TextAlignCode,
	SizeSpinnersCode,
	StyleCSSCode,
	ButtonsCode,
	Buttons2Code
} from 'data/code/SpinnersCode';

// import widget/custom components
import { StatRightTopIcon } from "widgets";

// import sub components
import { ActiveProjects, Teams, 
    FlightPerformance 
} from "sub-components";

// import required data files
import ProjectsStatsData from "data/dashboard/ProjectsStatsData";
import { useUser } from 'context/userContext'; 
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const Home = () => {
    
    const router = useRouter()
    const { usuario,setUsuario } = useUser();
    useEffect(() => {
        const verificarSesion = async () => {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin_v2/get_session`, {
              credentials: 'include',
            });
    
            if (res.status === 401) {
              router.push('/authentication/sign-in');
              return;
            }
    
            const data = await res.json();
            if (!data.usuario) {
              router.push('/authentication/sign-in');
              return;
            }
    
            // Guardar el usuario en estado si lo necesitas en el componente
            setUsuario(data.usuario);
          } catch (err) {
            router.push('/authentication/sign-in');
          }
        };
    
        verificarSesion();
    }, [router]);
    
    if (!usuario) {
        return <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>; // o spinner
    }
    return (
        <Fragment>
            <div className="bg-primary pt-10 pb-21"></div>
            <Container fluid className="mt-n22 px-6">
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        {/* Page header */}
                        <div>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="mb-2 mb-lg-0">
                                    <h3 className="mb-0  text-white">Home </h3>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Row className="my-6">
                    <Col xl={12} lg={12} md={12} xs={12} className="mb-6 mb-xl-0">

                        {/* Tasks Performance  */}
                        <MonthlyPaymentsChart />

                    </Col>
                </Row>

                <Row className="my-6">
                  <Col xl={4} lg={12} md={12} xs={12} className="mb-6 mb-xl-0">

                    {/* Tasks Performance  */}
                    <FlightPerformance />

                  </Col>
                  <Col xl={8} lg={12} md={12} xs={12} className="mb-6 mb-xl-0">

                      {/* Tasks Performance  */}
                      <PayrollAreaChart />

                  </Col>
                  
                </Row>
                <Row className="my-6">
                    <Col xl={6} lg={12} md={12} xs={12} className="mb-6 mb-xl-0">

                        {/* Tasks Performance  */}
                        <GooglePieChart />

                    </Col>
                    {/* card  */}
                    <Col xl={6} lg={12} md={12} xs={12}>

                        {/* Teams  */}
                        <GoogleScatterChart />

                    </Col>
                </Row>
            </Container>
        </Fragment>
    )
}
export default Home;


const GooglePieChart = () => {
    const [areas, setAreas] = useState([]);
    const [isGoogleReady, setIsGoogleReady] = useState(false);
  
    useEffect(() => {
      const script = document.createElement('script');
      script.src = 'https://www.gstatic.com/charts/loader.js';
      script.onload = () => {
        window.google.charts.load('current', { packages: ['corechart'] });
        window.google.charts.setOnLoadCallback(() => setIsGoogleReady(true));
      };
      document.head.appendChild(script);
    }, []);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin_v2/workers/report-by-area`, {
            credentials: 'include',
          });
          const json = await res.json();
          setAreas(json.trabajadores_por_area || []);
        } catch (error) {
          console.error('Error al obtener datos del backend:', error);
        }
      };
  
      fetchData();
    }, []);
  
    useEffect(() => {
      if (isGoogleReady && areas.length > 0) {
        const chartData = [['Área', 'Cantidad']];
        areas.forEach(item => {
          chartData.push([item.area, item.cantidad]);
        });
  
        const data = window.google.visualization.arrayToDataTable(chartData);
  
        const options = {
          title: 'Trabajadores por Área',
          pieHole: 0.3,
        };
  
        const chart = new window.google.visualization.PieChart(document.getElementById('piechart'));
        chart.draw(data, options);
      }
    }, [isGoogleReady, areas]);
  
    return (
        <Card className="h-100">
            <Card.Body>
                <div id="piechart" style={{ width: '100%', height: '500px' }} />
            </Card.Body>
        </Card>
       )
  };
  const GoogleScatterChart = () => {
    const [datos, setDatos] = useState([]);
    const [isGoogleReady, setIsGoogleReady] = useState(false);
  
    // Cargar Google Charts (una vez)
    useEffect(() => {
      const script = document.createElement('script');
      script.src = 'https://www.gstatic.com/charts/loader.js';
      script.onload = () => {
        window.google.charts.load('current', { packages: ['corechart'] });
        window.google.charts.setOnLoadCallback(() => setIsGoogleReady(true));
      };
      document.head.appendChild(script);
    }, []);
  
    // Obtener datos del backend (una vez)
    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin_v2/workers/edad-salario`, {
            credentials: 'include',
          });
          const json = await res.json();
          setDatos(json || []);
        } catch (error) {
          console.error('Error al obtener datos del backend:', error);
        }
      };
  
      fetchData();
    }, []);
  
    // Dibujar gráfico cuando los datos y Google Charts estén listos
    useEffect(() => {
      if (isGoogleReady && datos.length > 0) {
        const chartData = [['Edad', 'Salario']];
        datos.forEach(item => {
          chartData.push([item.edad, item.salario]);
        });
  
        const data = window.google.visualization.arrayToDataTable(chartData);
  
        const options = {
          title: 'Edad vs. Salario de Trabajadores',
          hAxis: { title: 'Edad' },
          vAxis: { title: 'Salario' },
          legend: 'none'
        };
  
        const chart = new window.google.visualization.ScatterChart(
          document.getElementById('scatterchart')
        );
        chart.draw(data, options);
      }
    }, [isGoogleReady, datos]);
  
    return (
      <Card className="h-100">
        <Card.Body>
          <div id="scatterchart" style={{ width: '100%', height: '500px' }} />
        </Card.Body>
      </Card>
    );
  };


  const PayrollAreaChart = () => {
    const [datos, setDatos] = useState([]);
    const [isGoogleReady, setIsGoogleReady] = useState(false);
  
    // Cargar Google Charts (solo una vez)
    useEffect(() => {
      const script = document.createElement('script');
      script.src = 'https://www.gstatic.com/charts/loader.js';
      script.onload = () => {
        window.google.charts.load('current', { packages: ['corechart'] });
        window.google.charts.setOnLoadCallback(() => setIsGoogleReady(true));
      };
      document.head.appendChild(script);
    }, []);
  
    // Obtener datos reales del backend
    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin_v2/payrolls/summary-last-year`, {
            credentials: 'include',
          });
          if (!res.ok) throw new Error('Network response was not ok');
          const json = await res.json();
          setDatos(json || []);
        } catch (error) {
          console.error('Error fetching payroll summary:', error);
        }
      };
  
      fetchData();
    }, []);
  
    // Dibujar gráfico cuando Google esté listo y datos cargados
    useEffect(() => {
      if (isGoogleReady && datos.length > 0) {
        const chartData = [
          ['Mes-Año', 'Pago neto', 'Deducciones'],
          ...datos.map(item => [
            item.month_year,
            item.total_net_pay,
            item.total_deductions
          ])
        ];
  
        const data = window.google.visualization.arrayToDataTable(chartData);
  
        const options = {
          title: 'Nómina total del año',
          hAxis: { title: 'Mes-Año', titleTextStyle: { color: '#333' } },
          vAxis: { minValue: 0 },
          colors: ['#1b9e77', '#d95f02'],
          areaOpacity: 0.3,
          curveType: 'function',
          legend: { position: 'bottom' }
        };
  
        const chart = new window.google.visualization.AreaChart(
          document.getElementById('payroll_chart')
        );
        chart.draw(data, options);
      }
    }, [isGoogleReady, datos]);
  
    
    return (
        <Card className="h-100">
          <Card.Body>
            <div id="payroll_chart" style={{ width: '100%', height: '500px' }} />
          </Card.Body>
        </Card>
      );
  };


  const FlightCharts = () => {
    const [data, setData] = useState({ completado: 0, retrasado: 0, cancelado: 0 });
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin_v2/planes/status-summary`, {
            credentials: 'include',
          });
          const result = await res.json();
  
          const counts = { completado: 0, retrasado: 0, cancelado: 0 };
          result.forEach(({ status, count }) => {
            if (status === 'completado') counts.completado = count;
            if (status === 'retrasado') counts.retrasado = count;
            if (status === 'cancelado') counts.cancelado = count;
          });
  
          setData(counts);
        } catch (err) {
          console.error("Error loading status summary:", err);
        }
      };
  
      fetchData();
    }, []);
  
    const total = data.completado + data.retrasado + data.cancelado || 1;
  
    const perfomanceChartSeries = [
      (data.completado / total) * 100,
      (data.retrasado / total) * 100,
      (data.cancelado / total) * 100
    ];
  
    const perfomanceChartOptions = {
      dataLabels: { enabled: false },
      labels: ['Completed', 'In-Progress', 'Behind'],
      colors: ['#28a745', '#ffc107', '#dc3545'],
      plotOptions: {
        radialBar: {
          startAngle: -168,
          endAngle: -450,
          hollow: {
            size: '55%',
          },
          track: {
            background: 'transparent',
          },
          dataLabels: {
            show: false,
          }
        }
      },
      chart: { type: 'radialBar' },
      stroke: { lineCap: "round" },
      responsive: [
        {
          breakpoint: 480,
          options: { chart: { height: 300 } }
        },
        {
          breakpoint: 5000,
          options: { chart: { height: 320 } }
        }
      ]
    };
  
    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
      <Link
        href=""
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
        className="text-muted text-primary-hover"
      >
        {children}
      </Link>
    ));
  
    CustomToggle.displayName = 'CustomToggle';
  
    const ActionMenu = () => {
      return (
        <Dropdown>
          <Dropdown.Toggle as={CustomToggle}>
            <MoreVertical size="15px" className="text-muted" />
          </Dropdown.Toggle>
          <Dropdown.Menu align={'end'}>
            <Dropdown.Item eventKey="1">Action</Dropdown.Item>
            <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
            <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
    };
  
    return (
      <Card className="h-100">
        <Card.Body>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h4 className="mb-0">Tasks Performance</h4>
            </div>
            <ActionMenu />
          </div>
  
          <div className="mb-8">
            <Chart
              options={perfomanceChartOptions}
              series={perfomanceChartSeries}
              type="radialBar"
              width="100%"
            />
          </div>
  
          <div className="d-flex align-items-center justify-content-around">
            <div className="text-center">
              <i className="fe fe-check-circle text-success fs-3"></i>
              <h1 className="mt-3 mb-1 fw-bold">{Math.round(perfomanceChartSeries[0])}%</h1>
              <p>Completed</p>
            </div>
            <div className="text-center">
              <i className="fe fe-trending-up text-warning fs-3"></i>
              <h1 className="mt-3 mb-1 fw-bold">{Math.round(perfomanceChartSeries[1])}%</h1>
              <p>In-Progress</p>
            </div>
            <div className="text-center">
              <i className="fe fe-trending-down text-danger fs-3"></i>
              <h1 className="mt-3 mb-1 fw-bold">{Math.round(perfomanceChartSeries[2])}%</h1>
              <p>Behind</p>
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  };
  


  const MonthlyPaymentsChart = () => {
    const [datos, setDatos] = useState([]);
    const [currency, setCurrency] = useState('USD');
    const [year, setYear] = useState(null);
    const [isGoogleReady, setIsGoogleReady] = useState(false);
  
    // Cargar Google Charts (solo una vez)
    useEffect(() => {
      const script = document.createElement('script');
      script.src = 'https://www.gstatic.com/charts/loader.js';
      script.onload = () => {
        window.google.charts.load('current', { packages: ['corechart'] });
        window.google.charts.setOnLoadCallback(() => setIsGoogleReady(true));
      };
      document.head.appendChild(script);
    }, []);
  
    // Obtener datos del backend
    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin_v2/payments/monthly-summary`, {
            method: 'POST',credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'year', year: 2025 }),
          });
  
          if (!res.ok) throw new Error('Error al obtener los datos');
          const json = await res.json();
  
          setDatos(json.monthly_summary || []);
          setCurrency(json.currency || 'USD');
          setYear(json.year || 2025);
        } catch (error) {
          console.error('Error al obtener el resumen mensual de pagos:', error);
        }
      };
  
      fetchData();
    }, []);
  
    // Dibujar gráfico
    useEffect(() => {
      if (isGoogleReady && datos.length > 0) {
        const chartData = [
          ['Mes', 'Monto total', 'Número de pagos'],
          ...datos.map(item => [
            new Date(0, item.month - 1).toLocaleString('default', { month: 'short' }),
            item.total_amount,
            item.payment_count
          ])
        ];
  
        const data = window.google.visualization.arrayToDataTable(chartData);
  
        const options = {
          title: `Resumen de pagos del año ${year} (${currency})`,
          hAxis: { title: 'Mes', titleTextStyle: { color: '#333' } },
          vAxis: { minValue: 0 },
          colors: ['#3366cc', '#dc3912'],
          areaOpacity: 0.2,
          curveType: 'function',
          legend: { position: 'bottom' }
        };
  
        const chart = new window.google.visualization.AreaChart(
          document.getElementById('monthly_payments_chart')
        );
        chart.draw(data, options);
      }
    }, [isGoogleReady, datos, currency, year]);
  
    return (
      <Card className="h-100">
        <Card.Body>
          <div id="monthly_payments_chart" style={{ width: '100%', height: '500px' }} />
        </Card.Body>
      </Card>
    );
  };
  