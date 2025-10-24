"use client";

import React, { useState } from "react";
import { 
  updateAppointmentStatus, 
  deleteAppointment,
  formatDateTime,
  isValidStatus
} from "@/lib/api";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  TableCell,
  TableRow,
} from "../ui/table";
import {
  Calendar,
  Clock,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

const statusOptions = ["booked", "completed", "canceled"];

export function AppointmentRow({ 
  appointment, 
  onViewDetails, 
  onEdit, 
  onDelete, 
  onStatusChange,
  onRefresh 
}) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusIcon = (status) => {
    switch (status) {
      case "booked":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "canceled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "booked":
        return "default";
      case "completed":
        return "outline";
      case "canceled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!isValidStatus(newStatus)) {
      alert("Invalid status selected");
      return;
    }
    
    setIsUpdatingStatus(true);
    try {
      await updateAppointmentStatus(appointment.id, newStatus);
      onStatusChange?.(appointment.id, newStatus);
      onRefresh?.();
    } catch (error) {
      console.error("Error updating appointment status:", error);
      alert("Failed to update appointment status: " + error.message);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this appointment?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAppointment(appointment.id);
      onDelete?.(appointment.id);
      onRefresh?.();
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert("Failed to delete appointment: " + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const startTime = formatDateTime(appointment.start_time);
  const endTime = formatDateTime(appointment.end_time);

  return (
    <TableRow key={appointment.id}>
      <TableCell>
        <div>
          <div className="font-medium text-foreground">{appointment.client_id}</div>
          <div className="text-sm text-muted-foreground">
            {appointment.client?.name || "N/A"}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div>
          <div className="font-medium text-foreground">{appointment.provider_id || "N/A"}</div>
          <div className="text-sm text-muted-foreground">
            {appointment.provider?.name || "N/A"}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div>
          <div className="font-medium text-foreground">{appointment.location_id}</div>
          <div className="text-sm text-muted-foreground">
            {appointment.location?.name || "N/A"}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div>
          <div className="font-medium text-foreground">{appointment.service_id || "N/A"}</div>
          <div className="text-sm text-muted-foreground">
            {appointment.service?.name || "N/A"}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div>
          <div className="font-medium text-foreground">{appointment.package_id || "N/A"}</div>
          <div className="text-sm text-muted-foreground">
            {appointment.package?.name || "N/A"}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="text-sm text-foreground">{startTime.date}</div>
            <div className="text-sm text-muted-foreground">{startTime.time}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="text-sm text-foreground">{endTime.date}</div>
            <div className="text-sm text-muted-foreground">{endTime.time}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          {getStatusIcon(appointment.status)}
          <Select 
            value={appointment.status} 
            onValueChange={handleStatusChange}
            disabled={isUpdatingStatus}
          >
            <SelectTrigger className="w-24 h-8 bg-input-background border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </TableCell>
      <TableCell>
        <div className="max-w-xs truncate text-sm text-muted-foreground">
          {appointment.notes || "N/A"}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails?.(appointment)}
            className="border-border hover:bg-primary/5"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit?.(appointment)}
            className="border-border hover:bg-primary/5"
            title="Edit Appointment"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="border-border hover:bg-destructive/5 hover:text-destructive"
            title="Delete Appointment"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

