import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToolTracking } from "@/hooks/useToolTracking";

interface Course {
  id: number;
  name: string;
  grade: string;
  credits: number;
}

const GPACalculator = () => {
  useToolTracking("GPA Calculator");
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, name: "", grade: "A", credits: 3 }
  ]);
  const [scale, setScale] = useState<"4.0" | "5.0">("4.0");
  const [gpa, setGPA] = useState<number | null>(null);

  const gradePoints = {
    "4.0": {
      "A+": 4.0, "A": 4.0, "A-": 3.7,
      "B+": 3.3, "B": 3.0, "B-": 2.7,
      "C+": 2.3, "C": 2.0, "C-": 1.7,
      "D+": 1.3, "D": 1.0, "D-": 0.7,
      "F": 0.0
    },
    "5.0": {
      "A+": 5.0, "A": 5.0, "A-": 4.7,
      "B+": 4.3, "B": 4.0, "B-": 3.7,
      "C+": 3.3, "C": 3.0, "C-": 2.7,
      "D+": 2.3, "D": 2.0, "D-": 1.7,
      "F": 0.0
    }
  };

  const addCourse = () => {
    setCourses([...courses, { id: Date.now(), name: "", grade: "A", credits: 3 }]);
  };

  const removeCourse = (id: number) => {
    if (courses.length > 1) {
      setCourses(courses.filter(course => course.id !== id));
    }
  };

  const updateCourse = (id: number, field: keyof Course, value: any) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, [field]: value } : course
    ));
  };

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
      if (course.credits > 0) {
        const points = gradePoints[scale][course.grade as keyof typeof gradePoints[typeof scale]];
        totalPoints += points * course.credits;
        totalCredits += course.credits;
      }
    });

    const calculatedGPA = totalCredits > 0 ? totalPoints / totalCredits : 0;
    setGPA(parseFloat(calculatedGPA.toFixed(2)));
  };

  const clearAll = () => {
    setCourses([{ id: Date.now(), name: "", grade: "A", credits: 3 }]);
    setGPA(null);
  };

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.5) return "text-green-600";
    if (gpa >= 3.0) return "text-blue-600";
    if (gpa >= 2.5) return "text-yellow-600";
    return "text-red-600";
  };

  const grades = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"];

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

          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl">GPA Calculator</CardTitle>
              <CardDescription>Calculate your GPA and track academic performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="scale">GPA Scale</Label>
                  <Select value={scale} onValueChange={(v) => setScale(v as "4.0" | "5.0")}>
                    <SelectTrigger id="scale">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4.0">4.0 Scale</SelectItem>
                      <SelectItem value="5.0">5.0 Scale (Weighted)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addCourse} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Course
                </Button>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground px-2">
                  <div className="col-span-5">Course Name</div>
                  <div className="col-span-3">Grade</div>
                  <div className="col-span-3">Credits</div>
                  <div className="col-span-1"></div>
                </div>

                {courses.map((course) => (
                  <div key={course.id} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-5">
                      <Input
                        placeholder="e.g., Mathematics"
                        value={course.name}
                        onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Select 
                        value={course.grade} 
                        onValueChange={(v) => updateCourse(course.id, "grade", v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {grades.map((grade) => (
                            <SelectItem key={grade} value={grade}>
                              {grade} ({gradePoints[scale][grade as keyof typeof gradePoints[typeof scale]]})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        step="0.5"
                        value={course.credits}
                        onChange={(e) => updateCourse(course.id, "credits", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeCourse(course.id)}
                        disabled={courses.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-gradient-primary border-0" 
                  size="lg"
                  onClick={calculateGPA}
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Calculate GPA
                </Button>
                <Button 
                  variant="outline"
                  onClick={clearAll}
                >
                  Clear All
                </Button>
              </div>

              {gpa !== null && (
                <div className="bg-gradient-primary p-8 rounded-lg text-white text-center">
                  <div className="text-sm opacity-90 mb-2">Your GPA</div>
                  <div className={`text-6xl font-bold mb-2 ${getGPAColor(gpa)}`} style={{color: 'white'}}>
                    {gpa.toFixed(2)}
                  </div>
                  <div className="text-sm opacity-90">out of {scale}</div>
                  
                  <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-white/20 p-3 rounded">
                      <div className="opacity-80">Total Credits</div>
                      <div className="text-xl font-bold">
                        {courses.reduce((sum, c) => sum + c.credits, 0)}
                      </div>
                    </div>
                    <div className="bg-white/20 p-3 rounded">
                      <div className="opacity-80">Courses</div>
                      <div className="text-xl font-bold">{courses.length}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-muted p-4 rounded-lg text-sm">
                <h4 className="font-medium mb-2">Grade Scale ({scale})</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {grades.slice(0, 12).map((grade) => (
                    <div key={grade} className="flex justify-between">
                      <span>{grade}:</span>
                      <span className="font-mono">{gradePoints[scale][grade as keyof typeof gradePoints[typeof scale]]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GPACalculator;
