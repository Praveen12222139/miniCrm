
import { useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, Code } from "lucide-react";
import { NlSegmentInput } from "./NlSegmentInput";

interface SegmentBuilderProps {
  onRulesChange: (rules: any[]) => void;
}

export function SegmentBuilder({ onRulesChange }: SegmentBuilderProps) {
  const [rules, setRules] = useState<any[]>([]);
  const [currentRule, setCurrentRule] = useState({
    field: "total_spend",
    operator: "greater_than",
    value: "",
  });
  const [groupOperator, setGroupOperator] = useState<"AND" | "OR">("AND");

  const addRule = () => {
    if (!currentRule.value.trim()) return;
    
    const newRules = [...rules, { ...currentRule, id: Date.now() }];
    setRules(newRules);
    onRulesChange(newRules);
    
    // Reset current rule
    setCurrentRule({
      field: "total_spend",
      operator: "greater_than",
      value: "",
    });
  };

  const removeRule = (id: number) => {
    const newRules = rules.filter((rule) => rule.id !== id);
    setRules(newRules);
    onRulesChange(newRules);
  };

  const handleNlRules = (newRules: any[]) => {
    setRules([...rules, ...newRules]);
    onRulesChange([...rules, ...newRules]);
  };

  const getOperatorLabel = (operator: string) => {
    switch (operator) {
      case "greater_than":
        return ">";
      case "less_than":
        return "<";
      case "equals":
        return "=";
      case "not_equals":
        return "≠";
      case "contains":
        return "contains";
      case "not_contains":
        return "doesn't contain";
      default:
        return operator;
    }
  };

  const getFieldLabel = (field: string) => {
    switch (field) {
      case "total_spend":
        return "Total Spend";
      case "visit_count":
        return "Visit Count";
      case "days_since_last_purchase":
        return "Days Since Last Purchase";
      case "product_category":
        return "Product Category";
      case "city":
        return "City";
      case "loyalty_tier":
        return "Loyalty Tier";
      default:
        return field;
    }
  };

  return (
    <div className="space-y-4">
      <NlSegmentInput onRulesGenerated={handleNlRules} />
      
      <div className="bg-gray-50 border rounded-lg p-4">
        <div className="flex flex-wrap gap-2 mb-3">
          {rules.map((rule, index) => (
            <div key={rule.id} className="flex items-center">
              {index > 0 && (
                <span className="px-2 text-sm text-gray-500 font-medium">
                  {groupOperator}
                </span>
              )}
              <div className="bg-white border rounded-md py-1 px-3 flex items-center gap-2 shadow-sm">
                <span className="text-sm">{getFieldLabel(rule.field)}</span>
                <span className="text-xs text-gray-500">{getOperatorLabel(rule.operator)}</span>
                <span className="text-sm font-medium">{rule.value}</span>
                <button
                  type="button"
                  onClick={() => removeRule(rule.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {rules.length > 0 && (
          <div className="flex gap-2 mb-4">
            <Button
              type="button"
              size="sm"
              variant={groupOperator === "AND" ? "default" : "outline"}
              onClick={() => setGroupOperator("AND")}
              className="text-xs h-7"
            >
              AND
            </Button>
            <Button
              type="button"
              size="sm"
              variant={groupOperator === "OR" ? "default" : "outline"}
              onClick={() => setGroupOperator("OR")}
              className="text-xs h-7"
            >
              OR
            </Button>
          </div>
        )}

        <Card>
          <CardContent className="pt-4 pb-2">
            <div className="flex flex-wrap gap-2">
              <div className="w-[150px]">
                <Select
                  value={currentRule.field}
                  onValueChange={(value) =>
                    setCurrentRule({ ...currentRule, field: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="total_spend">Total Spend</SelectItem>
                    <SelectItem value="visit_count">Visit Count</SelectItem>
                    <SelectItem value="days_since_last_purchase">Days Since Purchase</SelectItem>
                    <SelectItem value="product_category">Product Category</SelectItem>
                    <SelectItem value="city">City</SelectItem>
                    <SelectItem value="loyalty_tier">Loyalty Tier</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-[150px]">
                <Select
                  value={currentRule.operator}
                  onValueChange={(value) =>
                    setCurrentRule({ ...currentRule, operator: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Operator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="greater_than">Greater Than</SelectItem>
                    <SelectItem value="less_than">Less Than</SelectItem>
                    <SelectItem value="equals">Equals</SelectItem>
                    <SelectItem value="not_equals">Not Equals</SelectItem>
                    <SelectItem value="contains">Contains</SelectItem>
                    <SelectItem value="not_contains">Doesn't Contain</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-[120px]">
                <Input
                  type="text"
                  placeholder="Value"
                  value={currentRule.value}
                  onChange={(e) =>
                    setCurrentRule({ ...currentRule, value: e.target.value })
                  }
                />
              </div>

              <Button type="button" size="icon" onClick={addRule}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {rules.length > 0 && (
          <div className="mt-4 text-xs text-gray-500 flex items-center">
            <Code className="h-3 w-3 mr-1" /> {rules.length} condition{rules.length > 1 ? 's' : ''} defined using {groupOperator} operator
          </div>
        )}
      </div>
    </div>
  );
}
