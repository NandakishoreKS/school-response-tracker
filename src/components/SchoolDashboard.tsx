import { useState } from "react";
import { SchoolCard, School } from "./SchoolCard";
import { AddSchoolForm } from "./AddSchoolForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const SchoolDashboard = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const addSchool = (schoolData: Omit<School, 'id'>) => {
    const newSchool: School = {
      ...schoolData,
      id: Date.now().toString(),
    };
    setSchools(prev => [...prev, newSchool]);
    setShowAddForm(false);
    toast({
      title: "School Added",
      description: `${schoolData.name} has been added to your tracking list.`,
    });
  };

  const updateSchoolStatus = (schoolId: string, status: School['status']) => {
    setSchools(prev => prev.map(school => 
      school.id === schoolId 
        ? { ...school, status, lastContacted: new Date() }
        : school
    ));
    
    const school = schools.find(s => s.id === schoolId);
    if (school) {
      toast({
        title: "Status Updated",
        description: `${school.name} status updated to ${status}.`,
      });
    }
  };

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusCounts = () => {
    const counts = {
      total: schools.length,
      'not-contacted': 0,
      'called': 0,
      'responded': 0,
      'no-response': 0,
      'follow-up': 0,
    };
    
    schools.forEach(school => {
      counts[school.status]++;
    });
    
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-primary rounded-xl p-6 text-white shadow-elevated">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">School Outreach Tracker</h1>
              <p className="text-primary-foreground/80">
                Manage and track your school communications efficiently
              </p>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-8 w-8" />
              <span className="text-2xl font-bold">{statusCounts.total}</span>
              <span className="text-primary-foreground/80">Schools</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
            <div className="text-2xl font-bold text-muted-foreground">{statusCounts['not-contacted']}</div>
            <div className="text-sm text-muted-foreground">Not Contacted</div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
            <div className="text-2xl font-bold text-pending">{statusCounts.called}</div>
            <div className="text-sm text-muted-foreground">Called</div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
            <div className="text-2xl font-bold text-success">{statusCounts.responded}</div>
            <div className="text-sm text-muted-foreground">Responded</div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
            <div className="text-2xl font-bold text-warning">{statusCounts['no-response']}</div>
            <div className="text-sm text-muted-foreground">No Response</div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border/50">
            <div className="text-2xl font-bold text-destructive">{statusCounts['follow-up']}</div>
            <div className="text-sm text-muted-foreground">Follow Up</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search schools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-primary hover:shadow-primary transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add School
          </Button>
        </div>

        {/* Add School Form */}
        {showAddForm && (
          <AddSchoolForm onAddSchool={addSchool} />
        )}

        {/* Schools Grid */}
        {filteredSchools.length === 0 && !showAddForm && (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg mb-4">
              {schools.length === 0 
                ? "No schools added yet. Click 'Add School' to get started!"
                : "No schools match your search."
              }
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchools.map((school) => (
            <SchoolCard
              key={school.id}
              school={school}
              onUpdateStatus={updateSchoolStatus}
            />
          ))}
        </div>
      </div>
    </div>
  );
};