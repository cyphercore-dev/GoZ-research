package main

import (
	"fmt"
	"net"
	"sort"
)

func worker(ports, results chan int) {
	for p := range ports {
		host := "35.236.168.104" // change to the host you want to mess with
		address := host + fmt.Sprintf("%d", p)
		conn, err := net.Dial("tcp", address)
		if err != nil {
			// send zero if closed
			results <- 0
			continue
		}
		conn.Close()
		// send the port number if open
		results <- p
	}
}

func main() {
	// more workers => faster execution => less reliable results
	workers := make(chan int, 200)
	// results channel communicates the results from the main thread
	results := make(chan int)
	var openports []int

	for i := 0; i < cap(workers); i++ {
		go worker(workers, results)
	}

	// send workers in a separate goroutine
	go func() {
		for i := 1; i <= 1024; i++ {
			workers <- i
		}
	}()

	// gather results
	for i := 0; i < 1024; i++ {
		port := <-results
		if port != 0 {
			openports = append(openports, port)
		}
	}

	close(workers)
	close(results)
	sort.Ints(openports)
	for _, port := range openports {
		fmt.Printf("%d open\n", port)
	}
}
