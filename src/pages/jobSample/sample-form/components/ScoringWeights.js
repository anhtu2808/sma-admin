import React from "react";
import { Slider, Form, Switch, Checkbox, Tooltip } from "antd";
import { useGetCriteriaQuery } from "@/apis/jobSampleApi";
import Loading from "@/components/Loading";

const CriterionRow = ({
  criteriaItem,
  isAiActive,
  getFieldValue,
  setFieldsValue,
  remainingWeight
}) => {
  const isEnabled = getFieldValue(`enable_${criteriaItem.id}`) !== false;
  const currentWeight = getFieldValue(`weight_${criteriaItem.id}`) || 0;

  const maxAllowed = isEnabled
    ? Math.min(100, currentWeight + remainingWeight)
    : 100;

  return (
    <div className={`${!isEnabled ? "opacity-50" : ""}`}>
      <div className="flex justify-between mb-1 text-sm items-center">
        <div className="flex items-center gap-2">
          <Form.Item
            name={`enable_${criteriaItem.id}`}
            valuePropName="checked"
            initialValue={true}
            noStyle
          >
            <Checkbox
              disabled={!isAiActive || (!isEnabled && maxAllowed < currentWeight)}
              onChange={(e) => {
                if (e.target.checked) {
                  if (currentWeight > remainingWeight) {
                    setFieldsValue({
                      [`weight_${criteriaItem.id}`]: remainingWeight
                    });
                  }
                }
              }}
            />
          </Form.Item>

          <span className="text-gray-700 dark:text-gray-300 font-medium">
            {criteriaItem.name}
          </span>
        </div>

        <span className="text-orange-500 font-medium">
          {isEnabled ? `${currentWeight}%` : "0%"}
        </span>
      </div>

      <Form.Item
        name={`weight_${criteriaItem.id}`}
        initialValue={criteriaItem.defaultWeight}
        noStyle
      >
        <Slider
          trackStyle={{ backgroundColor: "#F97316" }}
          handleStyle={{
            borderColor: "#F97316",
            backgroundColor: "#F97316"
          }}
          disabled={!isAiActive || !isEnabled}
          max={100}
          onChange={(val) => {
            if (val > maxAllowed) {
              setFieldsValue({
                [`weight_${criteriaItem.id}`]: maxAllowed
              });
            }
          }}
        />
      </Form.Item>
    </div>
  );
};

const ScoringWeights = () => {
  const { data: criteriaRes, isLoading } = useGetCriteriaQuery();
  const criteriaList = criteriaRes?.data || [];

  return (
    <Form.Item
      noStyle
      shouldUpdate={(prevValues, currentValues) => {
        if (prevValues.enableAiScoring !== currentValues.enableAiScoring) return true;

        for (const item of criteriaList) {
          if (prevValues[`enable_${item.id}`] !== currentValues[`enable_${item.id}`])
            return true;

          if (prevValues[`weight_${item.id}`] !== currentValues[`weight_${item.id}`])
            return true;
        }

        if (prevValues.autoRejectThreshold !== currentValues.autoRejectThreshold)
          return true;

        return false;
      }}
    >
      {({ getFieldValue, setFieldsValue }) => {
        const isAiActive = getFieldValue("enableAiScoring") !== false;

        const updates = {};
        let needsUpdate = false;

        if (!isAiActive) {
          criteriaList.forEach((criteria) => {
            if (getFieldValue(`enable_${criteria.id}`) !== false) {
              updates[`enable_${criteria.id}`] = false;
              needsUpdate = true;
            }
          });
        } else {
          const allDisabled = criteriaList.every(
            (c) => getFieldValue(`enable_${c.id}`) === false
          );

          if (allDisabled && criteriaList.length > 0) {
            criteriaList.forEach((criteria) => {
              updates[`enable_${criteria.id}`] = true;
              updates[`weight_${criteria.id}`] = criteria.defaultWeight;
              needsUpdate = true;
            });
          }
        }

        if (needsUpdate) {
          setTimeout(() => {
            setFieldsValue(updates);
          }, 0);
        }

        let currentTotalWeight = 0;

        if (isAiActive) {
          criteriaList.forEach((item) => {
            const enabled = getFieldValue(`enable_${item.id}`) !== false;
            const weight = getFieldValue(`weight_${item.id}`) || 0;

            if (enabled) currentTotalWeight += weight;
          });
        }

        const isOver100 = currentTotalWeight > 100;
        const remainingWeight = Math.max(0, 100 - currentTotalWeight);

        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">

            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-icons-round text-orange-500">
                  psychology
                </span>
                AI Scoring Weights
              </h3>

              <Form.Item
                name="enableAiScoring"
                valuePropName="checked"
                initialValue={true}
                noStyle
              >
                <Switch
                  checkedChildren="AI Active"
                  unCheckedChildren="AI Off"
                  className={isAiActive ? "!bg-orange-500" : "!bg-gray-400"}
                />
              </Form.Item>
            </div>

            <div
              className={`space-y-6 transition-all duration-300 ${!isAiActive ? "opacity-50 grayscale pointer-events-none" : ""
                }`}
            >
              <div className="flex justify-between items-center bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-100 dark:border-orange-900/30">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Total Allocated Weight:
                </span>

                <span
                  className={`text-sm font-bold ${isOver100
                    ? "text-red-500"
                    : currentTotalWeight === 100
                      ? "text-green-500"
                      : "text-orange-500"
                    }`}
                >
                  {currentTotalWeight}% / 100%
                </span>
              </div>

              {isLoading ? (
                <div className="flex justify-center p-4">
                  <Loading inline size={76} />
                </div>
              ) : (
                criteriaList.map((item) => (
                  <CriterionRow
                    key={item.id}
                    criteriaItem={item}
                    isAiActive={isAiActive}
                    getFieldValue={getFieldValue}
                    setFieldsValue={setFieldsValue}
                    remainingWeight={remainingWeight}
                  />
                ))
              )}
            </div>
          </div>
        );
      }}
    </Form.Item>
  );
};

export default ScoringWeights;