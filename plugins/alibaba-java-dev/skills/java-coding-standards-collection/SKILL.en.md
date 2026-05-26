---
name: java-coding-standards-collection
description: Use when working with Java collections — List, Map, Set, Collection, ArrayList, HashMap, HashSet
paths:
  - "**/src/**/*List*.java"
  - "**/src/**/*Map*.java"
  - "**/src/**/*Set*.java"
  - "**/src/**/*Collection*.java"
---

# Collection Processing Conventions

## (VI) Collection Processing

1.【Mandatory】 Rules for hashCode and equals:
1) If overriding equals, must override hashCode.
2) Objects stored in Set must override both methods.
3) Custom objects as Map keys must override both methods.

2.【Mandatory】 Use isEmpty() method to check if collection is empty, not size() == 0.

3.【Mandatory】 When using Collectors.toMap(), must use method with BinaryOperator parameter, otherwise same key throws IllegalStateException.

4.【Mandatory】 When using Collectors.toMap(), note that null value throws NPE.

5.【Mandatory】 ArrayList.subList() result cannot be cast to ArrayList.

6.【Mandatory】 Collections returned by keySet() / values() / entrySet() cannot have elements added.

7.【Mandatory】 Collections.emptyList() / singletonList() are immutable, cannot add or remove elements.

8.【Mandatory】 In subList scenario, adding/removing parent collection elements causes ConcurrentModificationException in child list.

9.【Mandatory】 Use toArray(T[] array) with exact type and length 0 array.
Positive example: String[] array = list.toArray(new String[0]);

10.【Mandatory】 When using addAll(), check input collection for NPE.

11.【Mandatory】 Arrays.asList() result cannot use add / remove / clear methods, throws UnsupportedOperationException.

12.【Mandatory】 Generic wildcard <? extends T> cannot use add, <? super T> cannot use get.
Explanation: PECS - Producer Extends, Consumer Super.

13.【Mandatory】 When assigning non-generic collection to generic collection, use instanceof check.

14.【Mandatory】 Do not remove/add elements in foreach loop. Use iterator instead.

15.【Mandatory】 In JDK7+, Comparator must satisfy three conditions or Arrays.sort throws IllegalArgumentException.

16.【Recommended】 In JDK7+, use diamond syntax for generic collections.
Positive example: HashMap<String, String> userCache = new HashMap<>(16);

17.【Recommended】 Specify initial capacity when initializing collections.

18.【Recommended】 Use entrySet to traverse Map, not keySet. In JDK8, use Map.forEach.

19.【Recommended】 Pay attention to whether Map K/V can store null.
HashMap allows null; Hashtable, ConcurrentHashMap, TreeMap don't allow null key.

20.【Reference】 Use collection ordering and stability properly, avoid negative effects of unordered/unstable collections.

21.【Reference】 Use Set's unique element feature for quick deduplication.