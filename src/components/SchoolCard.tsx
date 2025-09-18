import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Calendar } from "lucide-react";

export interface School {
  id: string;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  status: 'not-contacted' | 'called' | 'responded' | 'no-response' | 'follow-up';
  lastContacted?: Date;
  notes?: string;
}

interface SchoolCardProps {
  school: School;
  onUpdateStatus: (schoolId: string, status: School['status']) => void;
}

const statusConfig = {
  'not-contacted': { label: 'Not Contacted', variant: 'secondary' as const },
  'called': { label: 'Called', variant: 'pending' as const },
  'responded': { label: 'Responded', variant: 'success' as const },
  'no-response': { label: 'No Response', variant: 'warning' as const },
  'follow-up': { label: 'Follow Up', variant: 'destructive' as const },
};

export const SchoolCard = ({ school, onUpdateStatus }: SchoolCardProps) => {
  const statusInfo = statusConfig[school.status];

  return (
    <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-200 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            {school.name}
          </CardTitle>
          <Badge variant={statusInfo.variant as any} className="ml-2">
            {statusInfo.label}
          </Badge>
        </div>
        {school.contactPerson && (
          <p className="text-sm text-muted-foreground">
            Contact: {school.contactPerson}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="space-y-2 text-sm">
          {school.phone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{school.phone}</span>
            </div>
          )}
          {school.email && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{school.email}</span>
            </div>
          )}
          {school.address && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{school.address}</span>
            </div>
          )}
          {school.lastContacted && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Last contacted: {school.lastContacted.toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {school.notes && (
          <div className="p-2 bg-muted/50 rounded-md">
            <p className="text-sm text-muted-foreground">{school.notes}</p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdateStatus(school.id, 'called')}
            className="flex-1"
          >
            Mark Called
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdateStatus(school.id, 'responded')}
            className="flex-1"
          >
            Responded
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};