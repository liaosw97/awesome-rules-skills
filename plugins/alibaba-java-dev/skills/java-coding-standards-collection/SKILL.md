---
name: java-coding-standards-collection
description: Use when working with Java collections — List, Map, Set, Collection, ArrayList, HashMap, HashSet
paths:
  - "**/src/**/*List*.java"
  - "**/src/**/*Map*.java"
  - "**/src/**/*Set*.java"
  - "**/src/**/*Collection*.java"
---

# 集合处理规约

## (六) 集合处理

1.【强制】 关于 hashCode 和 equals 的处理，遵循如下规则：
1）只要覆写 equals，就必须覆写 hashCode。
2）Set 存储的对象必须覆写这两种方法。
3）如果自定义对象作为 Map 的键，必须覆写 hashCode 和 equals。

2.【强制】 判断所有集合内部的元素是否为空，使用 isEmpty() 方法，而不是 size() == 0 的方式。
说明：在某些集合中，前者时间复杂度为 O(1)。

3.【强制】 在使用 Collectors.toMap() 方法转为 Map 集合时，一定要使用参数类型为 BinaryOperator 的方法，否则当出现相同 key 时会抛出 IllegalStateException。

4.【强制】 在使用 Collectors.toMap() 方法时，注意当 value 为 null 时会抛 NPE 异常。

5.【强制】 ArrayList 的 subList 结果不可强转成 ArrayList，否则会抛出 ClassCastException。

6.【强制】 使用 Map 的方法 keySet() / values() / entrySet() 返回集合对象时，不可以对其进行添加元素操作。

7.【强制】 Collections 类返回的对象（如 emptyList() / singletonList()）都是 immutable list，不可对其进行添加或删除元素操作。

8.【强制】 在 subList 场景中，对父集合元素的增加或删除，均会导致子列表遍历产生 ConcurrentModificationException。

9.【强制】 使用集合转数组的方法，必须使用集合的 toArray(T[] array)，传入类型完全一致、长度为 0 的空数组。
正例：String[] array = list.toArray(new String[0]);

10.【强制】 使用 Collection 接口任何实现类的 addAll() 方法时，要对输入的集合参数进行 NPE 判断。

11.【强制】 使用 Arrays.asList() 把数组转换成集合时，不能使用其修改集合相关的方法，它的 add / remove / clear 方法会抛出 UnsupportedOperationException。

12.【强制】 泛型通配符 <? extends T> 来接收返回的数据，此写法的泛型集合不能使用 add 方法，而 <? super T> 不能使用 get 方法。
说明：PECS 原则：频繁往外读取内容的，适合用 <? extends T>；经常往里插入的，适合用 <? super T>。

13.【强制】 在无泛型限制定义的集合赋值给泛型限制的集合时，使用集合元素时需要进行 instanceof 判断。

14.【强制】 不要在 foreach 循环里进行元素的 remove / add 操作。remove 元素请使用 iterator 方式。

15.【强制】 在 JDK7 版本及以上，Comparator 实现类要满足三个条件，否则 Arrays.sort / Collections.sort 会抛 IllegalArgumentException。

16.【推荐】 泛型集合使用时，在 JDK7 及以上，使用 diamond 语法或全省略。
正例：HashMap<String, String> userCache = new HashMap<>(16);

17.【推荐】 集合初始化时，指定集合初始值大小。
说明：HashMap 使用构造方法 HashMap(int initialCapacity) 进行初始化。

18.【推荐】 使用 entrySet 遍历 Map 类集合 KV，而不是 keySet 方式。如果是 JDK8，使用 Map.forEach 方法。

19.【推荐】 高度注意 Map 类集合 K/V 能不能存储 null 值的情况。
HashMap 允许为 null；Hashtable、ConcurrentHashMap、TreeMap 不允许 key 为 null。

20.【参考】 合理利用好集合的有序性和稳定性，避免集合的无序性和不稳定性带来的负面影响。

21.【参考】 利用 Set 元素唯一的特性，可以快速对一个集合进行去重操作。
