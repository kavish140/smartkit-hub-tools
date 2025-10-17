import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, BarChart3, Download, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

const ChartGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [chartType, setChartType] = useState<"bar" | "line" | "pie" | "doughnut">("bar");
  const [chartTitle, setChartTitle] = useState("My Chart");
  const [labels, setLabels] = useState("Jan,Feb,Mar,Apr,May");
  const [dataValues, setDataValues] = useState("12,19,3,5,2");
  const [dataLabel, setDataLabel] = useState("Dataset 1");
  const [datasets, setDatasets] = useState<{ label: string; data: number[]; color: string }[]>([]);
  const [showChart, setShowChart] = useState(false);

  const colors = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
    "#FF9F40", "#FF6384", "#C9CBCF", "#4BC0C0", "#FF6384"
  ];

  const addDataset = () => {
    if (!dataLabel.trim() || !dataValues.trim()) {
      toast({
        title: "Error",
        description: "Please enter both dataset label and values",
        variant: "destructive",
      });
      return;
    }

    const values = dataValues.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
    
    if (values.length === 0) {
      toast({
        title: "Error",
        description: "Please enter valid numbers separated by commas",
        variant: "destructive",
      });
      return;
    }

    const newDataset = {
      label: dataLabel,
      data: values,
      color: colors[datasets.length % colors.length]
    };

    setDatasets([...datasets, newDataset]);
    setDataValues("");
    setDataLabel(`Dataset ${datasets.length + 2}`);
    
    toast({
      title: "Dataset Added",
      description: `${dataLabel} has been added to the chart`,
    });
  };

  const removeDataset = (index: number) => {
    setDatasets(datasets.filter((_, i) => i !== index));
    toast({
      title: "Dataset Removed",
      description: "Dataset has been removed from the chart",
    });
  };

  const generateChart = () => {
    if (datasets.length === 0) {
      toast({
        title: "No Data",
        description: "Please add at least one dataset",
        variant: "destructive",
      });
      return;
    }

    setShowChart(true);
    toast({
      title: "Chart Generated",
      description: "Your chart has been created successfully",
    });
  };

  const downloadChart = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${chartTitle.replace(/\s+/g, '_')}.png`;
      link.href = url;
      link.click();
      
      toast({
        title: "Downloaded",
        description: "Chart has been saved as PNG",
      });
    }
  };

  const getChartData = () => {
    const labelArray = labels.split(',').map(l => l.trim());
    
    return {
      labels: labelArray,
      datasets: datasets.map((ds, index) => ({
        label: ds.label,
        data: ds.data,
        backgroundColor: chartType === 'pie' || chartType === 'doughnut' 
          ? colors.slice(0, ds.data.length)
          : ds.color,
        borderColor: ds.color,
        borderWidth: 2,
      }))
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: chartTitle,
        font: {
          size: 18
        }
      },
    },
  };

  const renderChart = () => {
    const data = getChartData();
    
    switch (chartType) {
      case 'bar':
        return <Bar data={data} options={chartOptions} />;
      case 'line':
        return <Line data={data} options={chartOptions} />;
      case 'pie':
        return <Pie data={data} options={chartOptions} />;
      case 'doughnut':
        return <Doughnut data={data} options={chartOptions} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gradient-subtle py-12">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tools
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
            {/* Chart Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Chart Generator</CardTitle>
                <CardDescription>Create beautiful charts from your data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Chart Type</Label>
                  <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bar">Bar Chart</SelectItem>
                      <SelectItem value="line">Line Chart</SelectItem>
                      <SelectItem value="pie">Pie Chart</SelectItem>
                      <SelectItem value="doughnut">Doughnut Chart</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Chart Title</Label>
                  <Input
                    placeholder="Enter chart title"
                    value={chartTitle}
                    onChange={(e) => setChartTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Labels (comma-separated)</Label>
                  <Input
                    placeholder="Jan, Feb, Mar, Apr"
                    value={labels}
                    onChange={(e) => setLabels(e.target.value)}
                  />
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Add Dataset</h3>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Dataset Label</Label>
                      <Input
                        placeholder="Sales, Revenue, etc."
                        value={dataLabel}
                        onChange={(e) => setDataLabel(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Values (comma-separated numbers)</Label>
                      <Textarea
                        placeholder="12, 19, 3, 5, 2"
                        value={dataValues}
                        onChange={(e) => setDataValues(e.target.value)}
                        rows={2}
                      />
                    </div>

                    <Button 
                      onClick={addDataset}
                      variant="outline"
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Dataset
                    </Button>
                  </div>
                </div>

                {datasets.length > 0 && (
                  <div className="space-y-2">
                    <Label>Added Datasets ({datasets.length})</Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {datasets.map((ds, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-2 bg-muted rounded"
                        >
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: ds.color }}
                            />
                            <span className="text-sm font-medium">{ds.label}</span>
                            <span className="text-xs text-muted-foreground">
                              ({ds.data.length} values)
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeDataset(index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button 
                  className="w-full bg-gradient-primary border-0"
                  onClick={generateChart}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Chart
                </Button>
              </CardContent>
            </Card>

            {/* Chart Display */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Preview</CardTitle>
                <CardDescription>Your generated chart will appear here</CardDescription>
              </CardHeader>
              <CardContent>
                {showChart && datasets.length > 0 ? (
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border">
                      {renderChart()}
                    </div>
                    <Button 
                      className="w-full"
                      variant="outline"
                      onClick={downloadChart}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download as PNG
                    </Button>
                  </div>
                ) : (
                  <div className="h-96 flex items-center justify-center bg-muted rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Add datasets and click "Generate Chart"
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="max-w-7xl mx-auto mt-6">
            <CardContent className="p-4">
              <div className="bg-muted p-4 rounded-lg text-sm">
                <p className="font-medium mb-2">💡 Quick Tips:</p>
                <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside">
                  <li>Choose your chart type first (bar, line, pie, or doughnut)</li>
                  <li>Enter labels for the X-axis (e.g., months, categories)</li>
                  <li>Add multiple datasets to compare different data series</li>
                  <li>Each dataset automatically gets a unique color</li>
                  <li>Download your chart as a PNG image for presentations</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChartGenerator;
