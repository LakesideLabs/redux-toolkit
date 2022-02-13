import ts from 'typescript';
import { getOperationName } from 'oazapfts/lib/codegen/generate';
import { capitalize, isQuery } from '../utils';
import type { OperationDefinition, EndpointOverrides } from '../types';
import { getOverrides } from '../generate';
import { factory } from '../utils/factory';

type GetReactHookNameParams = {
  operationDefinition: OperationDefinition;
  endpointOverrides: EndpointOverrides[] | undefined;
  endpointSuffix: string;
};

const getReactHookName = ({
  operationDefinition: { verb, path, operation },
  operationDefinition,
  endpointOverrides,
  endpointSuffix
}: GetReactHookNameParams) => {
  const overrides = getOverrides(operationDefinition, endpointOverrides);

  return factory.createBindingElement(
    undefined,
    undefined,
    factory.createIdentifier(
      `use${capitalize(getOperationName(verb, path, operation.operationId))}${endpointSuffix}${
        isQuery(verb, overrides) ? 'Query' : 'Mutation'
      }`
    ),
    undefined
  );
};

type GenerateReactHooksParams = {
  exportName: string;
  operationDefinitions: OperationDefinition[];
  endpointOverrides: EndpointOverrides[] | undefined;
  endpointSuffix: string
};
export const generateReactHooks = ({ exportName, operationDefinitions, endpointOverrides, endpointSuffix }: GenerateReactHooksParams) =>
  factory.createVariableStatement(
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createObjectBindingPattern(
            operationDefinitions.map((operationDefinition) =>
              getReactHookName({ operationDefinition, endpointOverrides, endpointSuffix })
            )
          ),
          undefined,
          undefined,
          factory.createIdentifier(exportName)
        ),
      ],
      ts.NodeFlags.Const
    )
  );
