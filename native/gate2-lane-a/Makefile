CC = clang
CFLAGS = -O3 -std=c11 -Wall -Wextra -march=native
LDFLAGS = -lpthread -lm

gate2: main.c
	$(CC) $(CFLAGS) -o gate2 main.c $(LDFLAGS)

selftest: gate2
	./gate2 selftest

anchor: gate2
	./gate2 anchor

clean:
	rm -f gate2

.PHONY: selftest anchor clean
