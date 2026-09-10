CC = clang
BREW = /opt/homebrew
CFLAGS = -O2 -std=c11 -Wall -Wextra -I$(BREW)/include
LDFLAGS = -L$(BREW)/lib -lflint -lpthread -lm

cert_window: cert_window.c
	$(CC) $(CFLAGS) -o cert_window cert_window.c $(LDFLAGS)

selfcheck: cert_window
	./cert_window selfcheck 128

# validation against the dd evaluator (builds ../gate2-lane-a/gate2 if needed)
validate: cert_window
	$(MAKE) -C ../gate2-lane-a gate2
	python3 validate_against_dd.py

dryrun: cert_window
	nice -n 10 ./cert_window dryrun 128 128 6

clean:
	rm -f cert_window

.PHONY: selfcheck validate dryrun clean
